import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { generateTokens } from '../utils/token';
import { addToBlacklist, isBlacklisted } from '../utils/tokenBlacklist';
import { SetPasswordDto } from './dto/set-password.dto';
import { SetPasswordByTokenDto } from './dto/set-password-by-token.dto';
import { emailTemplates, sendMail, sendNewUserEmail } from '../common/helpers';
import { VouchersService } from '../vouchers/vouchers.service';
import { UserOtp } from './schemas/otp.schema';
import { internalErrorHandler } from 'src/utils/utility.helper';
import { templates } from 'src/common/helpers/template';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserOtp.name) private otpModel: Model<UserOtp>,
    private vouchersService: VouchersService,

  ) { }



  private generateOTP(): string {
    return Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');
  }

  async register(createAuthDto: CreateAuthDto, res) {
    const {
      username,
      email,
      password,
      premiumSubscription,
      inAppUserId,
      voucherCode,
    } = createAuthDto;

    const query = inAppUserId ? { inAppUserId } : { email };

    // 🔍 Check for existing user
    const existingUser = await this.userModel.findOne(query);

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Normalize inAppUserId to array
    const normalizedInAppUserId = inAppUserId
      ? Array.isArray(inAppUserId)
        ? inAppUserId
        : [inAppUserId]
      : null;

    // 🎟️ Handle voucher code if provided
    let voucherValidationResult = null;
    let voucherId = null;
    let isPremium =
      (premiumSubscription as any) === 'true' ||
      (premiumSubscription as any) === true;

    if (voucherCode) {
      try {
        // Validate voucher exists and is valid
        const validation = await this.vouchersService.validateVoucher({
          code: voucherCode,
        });

        if (validation.isValid) {
          voucherValidationResult = validation.voucher;
          voucherId = validation.voucher.id;
          // Set user as premium if they use a valid voucher
          isPremium = true;
        }
      } catch (error) {
        // Voucher validation failed - we can still create the user but without premium status
        console.error('Voucher validation error:', error.message);
      }
    }

    // 🧑‍💻 Create new user
    const newUser = new this.userModel({
      username,
      email,
      premiumSubscription: isPremium,
      inAppUserId: normalizedInAppUserId,
      password: !password ? '' : hashedPassword,
      refreshToken: '',
      usedVoucher: voucherId,
      voucherCode: voucherCode ? voucherCode.toUpperCase() : null,
      voucherAppliedAt: voucherCode ? new Date() : null,
    });

    const { accessToken, refreshToken } = generateTokens({
      id: newUser?._id?.toString(),
      username: newUser?.username,
      inAppUserId: newUser?.inAppUserId,
      email: newUser?.email,
      premiumSubscription: newUser?.premiumSubscription,
      role: newUser?.role,
    });

    newUser['refreshToken'] = refreshToken;

    if (existingUser) {
      // throw new ConflictException(
      //   'Username or email/inAppUserId already exists',
      // );
      return {
        success: false,
        message: 'Username or email/inAppUserId already exists',
        accessToken,
        refreshToken,
      };
    }

    await newUser.save();

    // 🎟️ Apply voucher to user after user is created
    if (voucherCode && voucherId) {
      try {
        await this.vouchersService.applyVoucher(voucherCode, newUser._id);
      } catch (error) {
        console.error('Error applying voucher to user:', error.message);
      }
    }

    if (isPremium) {
      // 🔔 Notify admin
      const voucherInfo = voucherCode
        ? ` using voucher code ${voucherCode}`
        : '';
      await sendNewUserEmail({
        html: `New user ${username} (${email}) has registered and is now a premium user${voucherInfo}.`,
      });
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Return safe response (without password)
    return {
      success: true,
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      premiumSubscription: isPremium,
      voucherApplied: !!voucherCode,
    };
  }

  // async login(createAuthDto: CreateAuthDto, res, req) {
  //   try {
  //     const { email, password } = createAuthDto;

  //   const newUser = await this.userModel.findOne({ email });
  //   if (!newUser) throw new UnauthorizedException('Invalid credentials');
  //   if (newUser.isAccountDeleted) {
  //     throw new UnauthorizedException('Account has been deleted');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, newUser.password);
  //   if (!isPasswordValid)
  //     throw new UnauthorizedException('Invalid credentials');

  //   const { accessToken, refreshToken } = generateTokens({
  //     id: newUser?._id?.toString(),
  //     username: newUser?.username,
  //     inAppUserId: Array.isArray(newUser?.inAppUserId)
  //       ? newUser?.inAppUserId[0]
  //       : newUser?.inAppUserId,
  //     email: newUser?.email,
  //     premiumSubscription: newUser?.premiumSubscription,
  //     role: newUser?.role,
  //   });

  //   newUser['refreshToken'] = refreshToken;

  //   // 🧾 Generate JWT
  //   // const payload = user; // Simplified for this example
  //   // const token = await this.jwtService.signAsync(user);

  //   // send refresh token as secure cookie
  //   res.cookie('refreshToken', refreshToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'strict',
  //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //   });

  //   return {
  //     success: true,
  //     message: 'Login successful',
  //     accessToken,
  //     refreshToken,
  //   };
  //   } catch (error) {
  //      if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     return internalErrorHandler('Login failed', error);
  //   }
  // }

  async login(createAuthDto: CreateAuthDto, res, req) {
  try {
    const { email, password } = createAuthDto;

    const newUser = await this.userModel.findOne({ email });
    if (!newUser) throw new UnauthorizedException('Invalid credentials');

    if (newUser.isAccountDeleted) {
      throw new UnauthorizedException('Account has been deleted');
    }

    const isPasswordValid = await bcrypt.compare(password, newUser.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = generateTokens({
      id: newUser._id.toString(),
      username: newUser.username,
      inAppUserId: Array.isArray(newUser.inAppUserId)
        ? newUser.inAppUserId[0]
        : newUser.inAppUserId,
      email: newUser.email,
      premiumSubscription: newUser.premiumSubscription,
      role: newUser.role,
    });

    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException('Login failed');
  }
}

  async setPassword(setPasswordDto: SetPasswordDto) {
    const { email, password, inAppUserId } = setPasswordDto;

    // 🔍 Build query dynamically
    const query = inAppUserId ? { inAppUserId } : { email };
    console.log(query);

    const user = await this.userModel.findOne(query);

    if (!user) {
      throw new HttpException(
        { success: false, message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    // 🚫 Prevent overwriting existing password
    if (user.password?.trim()) {
      throw new HttpException(
        {
          success: false,
          message: 'Password is already set for this user',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 🔒 Hash password
    user.password = await bcrypt.hash(password, 10);

    // Optional: update identifiers if needed
    if (email) user.email = email;
    if (inAppUserId) {
      // ✅ Normalize inAppUserId to array
      const normalizedInAppUserId = Array.isArray(inAppUserId)
        ? inAppUserId
        : [inAppUserId];
      user.inAppUserId = normalizedInAppUserId;
    }

    await user.save();

    // 🔑 Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      inAppUserId: user.inAppUserId,
      premiumSubscription: user.premiumSubscription,
      role: user.role,
    });

    return {
      success: true,
      accessToken,
      refreshToken,
      message: 'Password set successfully',
    };
  }





  // reset password

  // resend otp
  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newOtp = this.generateOTP();
    user.otp = newOtp;

    console.log('otp',newOtp)

    await user.save();
    // const html = emailTemplates.otp(user.username, newOtp); // reuse your OTP template
    await sendMail({
      email: email,
      subject: "Forget Password Otp",
      htmlTemplate:  templates.otp('forgotPassword', { name: user?.email, otp:newOtp }),
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP has been resent successfully',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
          otp: newOtp,
        },
      },
    };
  }


  // async verifyForgetPassword(
  //   verifyForgetPassword: VerifyForgetPassword
  // ) {
  //   try {
  //     const { otp } = verifyForgetPassword;
  //     const user = await this.userModel.findOne({ otp });
  //     if (!user) {
  //       throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
  //     }

  //     if (new Date() > user.otpExpires) {
  //       throw new HttpException('OTP has expired', HttpStatus.UNAUTHORIZED);
  //     }

  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: 'Otp Verified',
  //       data: {
  //         user: {
  //           _id: user._id,
  //           email: user.email,
  //           username: user.username,
  //           role: user.role,
  //           isVerified: user.isVerified,
  //           profileImage: user.profileImage,
  //           country: user.country,
  //           phoneNumber: user.phoneNumber,
  //           ageGroup: user.ageGroup,
  //           soundEffect: user.soundEffect,
  //           timer: user.timer
  //         }
  //       }
  //     };
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // async resetPassword(
  //   resetPassword: ResetPasswordDto
  // ) {
  //   try {
  //     const { email, newPassword } = resetPassword;
  //     const user = await this.userModel.findOne({ email });
  //     if (!user) {
  //       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //     }

  //     const isSamePassword = await bcrypt.compare(newPassword, user.password);
  //     if (isSamePassword) {
  //       throw new HttpException(
  //         'New password cannot be the same as the current password',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     await this.userModel.updateOne(
  //       { email },
  //       {
  //         password: hashedPassword,
  //         otp: null,
  //         otpExpires: null,
  //       },
  //     );


  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: 'Password Reset SuccessFully',
  //       data: {
  //         user: {
  //           _id: user._id,
  //           email: user.email,
  //           username: user.username,
  //           role: user.role,
  //           isVerified: user.isVerified,
  //           profileImage: user.profileImage,
  //           country: user.country,
  //           phoneNumber: user.phoneNumber,
  //           ageGroup: user.ageGroup,
  //           soundEffect: user.soundEffect,
  //           timer: user.timer
  //         }
  //       }
  //     };
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


  async sendInvite(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException(
        { success: false, message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.email) {
      throw new HttpException(
        { success: false, message: 'User email is required to send invite' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        type: user.type || 'user',
      },
      process.env.INVITE_TOKEN_SECRET || process.env.JWT_SECRET || 'invite-secret',
      { expiresIn: '7d' },
    );

    const frontendUrl =
      process.env.ADMIN_APP_URL ||
      process.env.FRONTEND_URL ||
      'http://localhost:3000';
    const inviteLink = `${frontendUrl.replace(/\/$/, '')}/set-password?token=${token}`;

    await sendMail({
      email: user.email,
      subject: 'Set your password',
      htmlTemplate: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
          <h2>Welcome to ANF</h2>
          <p>Hello ${user.username || 'User'},</p>
          <p>Your account has been created. Click the button below to set your password and log in.</p>
          <p style="margin: 24px 0;">
            <a href="${inviteLink}" style="background:#0f766e;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Set Password</a>
          </p>
          <p>Or open this link:</p>
          <p><a href="${inviteLink}">${inviteLink}</a></p>
          <p>This link will expire in 7 days.</p>
        </div>
      `,
    });

    return { success: true, message: 'Invite sent successfully', inviteLink };
  }

  async validateInviteToken(token: string) {
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.INVITE_TOKEN_SECRET || process.env.JWT_SECRET || 'invite-secret',
      );
      const user = await this.userModel.findById(decoded.id).select('_id email username role type schoolId studentId');
      if (!user) {
        throw new Error('User not found');
      }
      return { success: true, data: user };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Invalid or expired invite token' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async setPasswordByInviteToken(dto: SetPasswordByTokenDto) {
    try {
      const decoded: any = jwt.verify(
        dto.token,
        process.env.INVITE_TOKEN_SECRET || process.env.JWT_SECRET || 'invite-secret',
      );

      const user = await this.userModel.findById(decoded.id);

      if (!user) {
        throw new Error('User not found');
      }

      user.password = await bcrypt.hash(dto.password, 10);
      user.isRegistered = true;
      await user.save();

      const { accessToken, refreshToken } = generateTokens({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        inAppUserId: user.inAppUserId,
        premiumSubscription: user.premiumSubscription,
        role: user.role,
      });

      user.refreshToken = refreshToken;
      await user.save();

      return {
        success: true,
        message: 'Password set successfully',
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Invalid or expired invite token' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async refresh(req, res, Authorization: string) {
    try {
      const refreshToken = Authorization?.split(' ')[1];
      // const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new HttpException(
          {
            success: false,
            message: 'No refresh token or invalid refresh token provided',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const decoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      );

      const user = await this.userModel.findById(decoded?.id);
      // Rotate tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens({
        id: user?._id?.toString(),
        username: user?.username,
        inAppUserId: Array.isArray(user?.inAppUserId)
          ? user?.inAppUserId[0]
          : user?.inAppUserId,
        email: user?.email,
        premiumSubscription: user?.premiumSubscription,
        role: user?.role,
      });

      await this.userModel.findByIdAndUpdate(user?._id, {
        refreshToken: newRefreshToken,
      });

      // ✅ Use cookie-parser globally, Nest will handle response
      req.res?.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { success: true, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new HttpException(
        { success: false, message: 'Invalid or expired refresh token' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async revokePremiumByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(
        { success: false, message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.premiumSubscription) {
      return {
        success: true,
        message: 'User already does not have premium subscription',
      };
    }

    user.premiumSubscription = false;
    await user.save();

    return {
      success: true,
      message: 'Premium subscription revoked successfully',
    };
  }

  async deletedAccount(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(
        { success: false, message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    user.isAccountDeleted = true;
    await user.save();

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  }

  async getPremiumSubscribers(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [subscribers, total] = await Promise.all([
        this.userModel
          .find({ premiumSubscription: true, isAccountDeleted: false })
          .select('-password -refreshToken')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.userModel.countDocuments({
          premiumSubscription: true,
          isAccountDeleted: false,
        }),
      ]);

      return {
        success: true,
        message: 'Premium subscribers retrieved successfully',
        data: subscribers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Error fetching premium subscribers' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserList(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const total = await this.userModel.countDocuments({ isAccountDeleted: false }).exec();
      const users = await this.userModel
        .find({ isAccountDeleted: false })
        .select('-__v -password -refreshToken')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        pagination: {
          page,
          limit,
          total
        }
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Error fetching user list' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(req, res) {
    try {
      // ✅ Extract Bearer token from Authorization header
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: 'No token provided' });
      }

      // ✅ Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as jwt.JwtPayload;

      // ✅ Add token jti to blacklist
      if (decoded?.jti) {
        addToBlacklist(decoded.jti);
      } else {
        throw new UnauthorizedException('Invalid token payload');
      }

      // ✅ Clear the refresh token cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      // ✅ Send success message
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logout successful. Token has been blacklisted.',
      });
    } catch (error) {
      console.error('Logout error:', error.message);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  }
  // async logout(req, res) {
  //   try {
  //     const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  //     if (!token) {
  //       throw new UnauthorizedException('No token provided');
  //     }

  //     const decoded = jwt.verify(
  //       token,
  //       process.env.JWT_SECRET,
  //     ) as jwt.JwtPayload;

  //     if (!decoded?.jti) {
  //       throw new UnauthorizedException('Invalid token payload');
  //     }

  //     addToBlacklist(decoded.jti);

  //     // ❌ Clear refresh token cookie (if used)
  //     res.clearCookie('refreshToken', {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === 'production',
  //       sameSite: 'strict',
  //     });

  //     return res.status(200).json({
  //       success: true,
  //       message: 'Logout successful. Token has been expired.',
  //     });
  //   } catch (error) {
  //     console.error('Refresh token error:', error);
  //     throw new HttpException(
  //       { success: false, message: 'Invalid or expired refresh token' },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  // }

  // // ✅ Logout: blacklist the refresh token
  // async logout(token: string) {
  //   try {
  //     const decoded = jwt.verify(
  //       token,
  //       process.env.JWT_REFRESH_SECRET,
  //     ) as jwt.JwtPayload;

  //     if (decoded.jti) {
  //       addToBlacklist(decoded.jti);
  //     } else {
  //       throw new UnauthorizedException('Invalid token payload');
  //     }

  //     return { message: 'Logout successful' };
  //   } catch (err) {
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }
  // }
}
