import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/schemas/user.schema';
import { CreateMobileAuthDto } from './dto/create-mobile-auth.dto';
import { UpdateMobileAuthDto } from './dto/update-mobile-auth.dto';
import { generateTokens } from '../utils/token';
import { sendNewUserEmail } from '../common/helpers';

@Injectable()
export class MobileAuthService {
  // ✅ Valid fields for User entity
  private readonly validUserFields = [
    'username',
    'password',
    'inAppUserId',
    'premiumSubscription',
    'isAccountDeleted',
    'email',
    'refreshToken',
    'isRegistered',
    'purchaseInfo',
    'deviceId',
    'mobileNumber',
    'appVersion',
    'osType',
    'lastLoginAt',
    'registrationToken',
    'role',
  ];

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * ✅ Validate payload fields against User entity
   */
  private validatePayloadFields(
    payload: any,
    operationType: string,
  ): { valid: boolean; error?: string } {
    if (!payload || typeof payload !== 'object') {
      return { valid: true };
    }

    const payloadFields = Object.keys(payload).filter(
      (key) => payload[key] !== undefined,
    );
    const invalidFields = payloadFields.filter(
      (field) => !this.validUserFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return {
        valid: false,
        error: `Invalid field(s) in ${operationType}: ${invalidFields.join(', ')}. Valid fields are: ${this.validUserFields.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * 🔐 Encrypt password using bcrypt
   */
  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * 🔍 Check if mobile user exists by inAppUserId
   */
  async checkUserExistenceByInAppUserId(inAppUserId: string) {
    try {
      // ✅ Validation: inAppUserId is required
      if (!inAppUserId || inAppUserId.trim().length === 0) {
        return {
          success: false,
          message: 'App User ID is required',
          exists: false,
          code: 'IN_APP_USER_ID_REQUIRED',
        };
      }

      // 🔎 Query user by inAppUserId (search in array)
      const user = await this.userModel
        .findOne({ inAppUserId: inAppUserId.trim() })
        .select('-password -refreshToken');

      // ✅ User doesn't exist
      if (!user) {
        return {
          success: true,
          message: 'User does not exist',
          exists: false,
          code: 'USER_NOT_FOUND',
        };
      }

      // ✅ Validation: Check if account is deleted
      if (user.isAccountDeleted) {
        return {
          success: true,
          message: 'User account has been deleted',
          exists: false,
          code: 'ACCOUNT_DELETED',
        };
      }

      // ✅ User exists and is active
      return {
        success: true,
        message: 'User exists',
        exists: true,
        code: 'USER_FOUND',
        user: {
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          inAppUserId: user.inAppUserId,
          premiumSubscription: user.premiumSubscription,
          purachaseInfo: user.purchaseInfo,
          isRegistered: user.isRegistered,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Error checking user',
          code: 'CHECK_USER_ERROR',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 🔧 Create a new mobile user
   */
  async create(createMobileAuthDto: CreateMobileAuthDto) {
    try {
      // ✅ Validate payload fields
      const fieldValidation = this.validatePayloadFields(
        createMobileAuthDto,
        'create',
      );
      if (!fieldValidation.valid) {
        return {
          success: false,
          message: fieldValidation.error,
          code: 'INVALID_FIELDS',
        };
      }

      // ✅ Normalize inAppUserId to array
      const inAppUserIds = Array.isArray(createMobileAuthDto.inAppUserId)
        ? createMobileAuthDto.inAppUserId
        : [createMobileAuthDto.inAppUserId];

      // ✅ Validation: Check if any of the inAppUserIds already exists
      const existingUserByAppId = await this.userModel.findOne({
        inAppUserId: { $in: inAppUserIds },
      });

      if (existingUserByAppId) {
        return {
          success: false,
          message: 'One or more App User IDs already registered',
          code: 'IN_APP_USER_ID_EXISTS',
        };
      }

      // ✅ Check if purchaseInfo contains transaction identifiers and if user already exists
      let existingUserByPurchase = null;
      if (createMobileAuthDto.purchaseInfo) {
        try {
          const purchaseData =
            typeof createMobileAuthDto.purchaseInfo === 'string'
              ? JSON.parse(createMobileAuthDto.purchaseInfo)
              : createMobileAuthDto.purchaseInfo;

          // Extract key identifiers from purchaseInfo
          const productId = purchaseData?.transaction?.productId;
          const originalAppUserId =
            purchaseData?.customerInfo?.originalAppUserId;

          // Search for user with matching purchase info
          if (productId || originalAppUserId) {
            existingUserByPurchase = await this.userModel.findOne({
              $or: [
                { purchaseInfo: { $regex: productId, $options: 'i' } },
                { purchaseInfo: { $regex: originalAppUserId, $options: 'i' } },
              ],
            });

            // If user found by purchase info, add new inAppUserId to existing user
            if (existingUserByPurchase) {
              const existingIds = existingUserByPurchase.inAppUserId || [];
              const mergedIds = [...new Set([...existingIds, ...inAppUserIds])];
              existingUserByPurchase.inAppUserId = mergedIds;

              // Update other fields if provided
              if (createMobileAuthDto.username) {
                existingUserByPurchase.username = createMobileAuthDto.username;
              }
              if (createMobileAuthDto.email) {
                existingUserByPurchase.email = createMobileAuthDto.email;
              }
              if (createMobileAuthDto.isRegistered !== undefined) {
                existingUserByPurchase.isRegistered =
                  createMobileAuthDto.isRegistered;
              }

              await existingUserByPurchase.save();

              return {
                success: true,
                message:
                  'App User ID added to existing user based on purchase info',
                code: 'USER_LINKED',
                user: {
                  _id: existingUserByPurchase._id.toString(),
                  inAppUserId: existingUserByPurchase.inAppUserId,
                  username: existingUserByPurchase.username,
                  email: existingUserByPurchase.email,
                  premiumSubscription:
                    existingUserByPurchase.premiumSubscription,
                  isRegistered: existingUserByPurchase.isRegistered,
                  purchaseInfo: existingUserByPurchase.purchaseInfo,
                },
              };
            } else {
              // 🔔 Notify admin
              await sendNewUserEmail({
                html: `A new mobile user has been registered for Product ID ${productId} (User: ${originalAppUserId}).`,
              });
            }
          }
        } catch (parseError) {
          // If purchaseInfo is not valid JSON, continue with new user creation
          console.log('Could not parse purchaseInfo:', parseError.message);
        }
      }

      // ✅ Create new user (if no existing user found by purchase info)
      const newUser = new this.userModel({
        username: createMobileAuthDto?.username || null,
        email: createMobileAuthDto?.email || null,
        inAppUserId: inAppUserIds,
        premiumSubscription: createMobileAuthDto?.premiumSubscription || false,
        isAccountDeleted: false,
        isRegistered: createMobileAuthDto?.isRegistered || false,
        purchaseInfo: createMobileAuthDto?.purchaseInfo || null,
        password: null,
        refreshToken: null,
      });

      await newUser.save();

      return {
        success: true,
        message: 'Mobile user created successfully',
        code: 'USER_CREATED',
        user: {
          _id: newUser._id.toString(),
          inAppUserId: newUser.inAppUserId,
          username: newUser.username,
          email: newUser.email,
          premiumSubscription: newUser.premiumSubscription,
          isRegistered: newUser.isRegistered,
          purchaseInfo: newUser.purchaseInfo,
        },
      };
    } catch (error) {
      console.error('Error creating mobile user:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Error creating mobile user',
          code: 'CREATE_USER_ERROR',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 🔄 Update mobile user information
   */
  async update(inAppUserId: string, updateMobileAuthDto: UpdateMobileAuthDto) {
    try {
      // ✅ Validate payload fields
      const fieldValidation = this.validatePayloadFields(
        updateMobileAuthDto,
        'update',
      );
      if (!fieldValidation.valid) {
        return {
          success: false,
          message: fieldValidation.error,
          code: 'INVALID_FIELDS',
        };
      }

      // ✅ Validation: Check if user exists by searching in inAppUserId array
      const user = await this.userModel.findOne({
        inAppUserId: inAppUserId.trim(),
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND',
        };
      }

      // ✅ Build update object with optional fields
      const updateData: any = { ...updateMobileAuthDto };

      // ✅ Handle inAppUserId array - add new IDs to existing array if provided
      if (updateMobileAuthDto.inAppUserId) {
        const newIds = Array.isArray(updateMobileAuthDto.inAppUserId)
          ? updateMobileAuthDto.inAppUserId
          : [updateMobileAuthDto.inAppUserId];

        // Check if any new inAppUserId already exists in other users
        const conflictingUser = await this.userModel.findOne({
          _id: { $ne: user._id },
          inAppUserId: { $in: newIds },
        });

        if (conflictingUser) {
          return {
            success: false,
            message:
              'One or more App User IDs are already registered to another user',
            code: 'IN_APP_USER_ID_CONFLICT',
          };
        }

        // Add new IDs to existing array (no duplicates)
        const existingIds = user.inAppUserId || [];
        const mergedIds = [...new Set([...existingIds, ...newIds])];
        updateData.inAppUserId = mergedIds;
      }

      // ✅ Handle password encryption if provided
      if (updateMobileAuthDto.password) {
        updateData.password = await this.encryptPassword(
          updateMobileAuthDto.password,
        );
      }

      // ✅ Only update isRegistered and purchaseInfo if they are provided
      if (updateMobileAuthDto.isRegistered !== undefined) {
        updateData.isRegistered = updateMobileAuthDto.isRegistered;
      }
      if (updateMobileAuthDto.purchaseInfo !== undefined) {
        updateData.purchaseInfo = updateMobileAuthDto.purchaseInfo;
      }

      // ✅ Update user
      const updatedUser = await this.userModel.findOneAndUpdate(
        { inAppUserId: inAppUserId.trim() },
        updateData,
        { new: true },
      );

      // ✅ Generate tokens
      const { accessToken, refreshToken } = generateTokens({
        id: updatedUser._id.toString(),
        username: updatedUser.username,
        inAppUserId: updatedUser.inAppUserId,
        email: updatedUser.email,
        premiumSubscription: updatedUser.premiumSubscription,
        role: updatedUser?.role,
      });

      // ✅ Update user with refresh token
      updatedUser.refreshToken = refreshToken;
      await updatedUser.save();

      return {
        success: true,
        message: 'Mobile user updated successfully',
        code: 'USER_UPDATED',
        accessToken,
        refreshToken,
        user: {
          _id: updatedUser._id.toString(),
          inAppUserId: updatedUser.inAppUserId,
          username: updatedUser.username,
          email: updatedUser.email,
          premiumSubscription: updatedUser.premiumSubscription,
          isRegistered: updatedUser.isRegistered,
          purchaseInfo: updatedUser.purchaseInfo,
        },
      };
    } catch (error) {
      console.log('Error updating mobile user:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Error updating mobile user',
          code: 'UPDATE_USER_ERROR',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
