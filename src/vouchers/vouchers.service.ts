import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Voucher } from './schemas/voucher.schema';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name) private voucherModel: Model<Voucher>,
  ) {}

  /**
   * Create a new voucher
   */
  async create(createVoucherDto: CreateVoucherDto) {
    const { code, expiryDate, ...rest } = createVoucherDto;

    // Check if voucher already exists
    const existingVoucher = await this.voucherModel.findOne({
      code: code.toUpperCase(),
    });

    if (existingVoucher) {
      throw new ConflictException('Voucher code already exists');
    }

    // Validate expiry date
    if (new Date(expiryDate) <= new Date()) {
      throw new BadRequestException('Expiry date must be in the future');
    }

    const newVoucher = new this.voucherModel({
      code: code.toUpperCase(),
      expiryDate,
      ...rest,
    });

    return await newVoucher.save();
  }

  /**
   * Validate and get voucher details
   */
  async validateVoucher(validateVoucherDto: ValidateVoucherDto) {
    const { code } = validateVoucherDto;

    const voucher = await this.voucherModel.findOne({
      code: code.toUpperCase(),
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    // Check if voucher is active
    if (!voucher.isActive) {
      throw new BadRequestException('Voucher is not active');
    }

    // Check if voucher has expired
    if (new Date(voucher.expiryDate) <= new Date()) {
      throw new BadRequestException('Voucher has expired');
    }

    // Check if voucher has reached max uses
    if (voucher.currentUses >= voucher.maxUses) {
      throw new BadRequestException('Voucher has reached maximum uses');
    }

    return {
      isValid: true,
      voucher: {
        id: voucher._id,
        code: voucher.code,
        subscriptionType: voucher.subscriptionType,
        description: voucher.description,
      },
    };
  }

  /**
   * Apply voucher to a user (mark as used)
   */
  async applyVoucher(voucherCode: string, userId: any) {
    const voucher = await this.voucherModel.findOne({
      code: voucherCode.toUpperCase(),
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    // Check if voucher is valid
    if (!voucher.isActive) {
      throw new BadRequestException('Voucher is not active');
    }

    if (new Date(voucher.expiryDate) <= new Date()) {
      throw new BadRequestException('Voucher has expired');
    }

    if (voucher.currentUses >= voucher.maxUses) {
      throw new BadRequestException('Voucher has reached maximum uses');
    }

    // Check if user already used this voucher
    if (voucher.usedBy.includes(userId)) {
      throw new ConflictException('You have already used this voucher');
    }

    // Update voucher
    voucher.currentUses += 1;
    voucher.usedBy.push(userId);
    await voucher.save();

    return {
      success: true,
      message: 'Voucher applied successfully',
      voucherId: voucher._id,
      subscriptionType: voucher.subscriptionType,
    };
  }

  /**
   * Get all vouchers (admin only)
   */
  async findAll(filters?: {
    isActive?: boolean;
    code?: string;
    page?: number;
    limit?: number;
  }) {
    const query: any = {};

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.code) {
      query.code = { $regex: filters.code, $options: 'i' };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const total = await this.voucherModel.countDocuments(query);
    const vouchers = await this.voucherModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      message: 'Vouchers fetched successfully',
      data: vouchers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  /**
   * Get voucher by ID
   */
  async findById(id: string) {
    const voucher = await this.voucherModel.findById(id).populate('usedBy');

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return voucher;
  }

  /**
   * Update voucher
   */
  async update(id: string, updateVoucherDto: UpdateVoucherDto) {
    const voucher = await this.voucherModel.findByIdAndUpdate(
      id,
      { ...updateVoucherDto, updatedAt: new Date() },
      { new: true },
    );

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return voucher;
  }

  /**
   * Toggle voucher status (activate/deactivate)
   */
  async toggleVoucherStatus(id: string) {
    const voucher = await this.voucherModel.findById(id);

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    // Toggle the active status
    voucher.isActive = !voucher.isActive;
    voucher.updatedAt = new Date();
    await voucher.save();

    const action = voucher.isActive ? 'activated' : 'deactivated';

    return {
      success: true,
      message: `Voucher ${action} successfully`,
      data: {
        _id: voucher._id,
        code: voucher.code,
        isActive: voucher.isActive,
      },
    };
  }

  /**
   * Permanently delete voucher from database (hard delete)
   */
  async hardDelete(id: string) {
    const voucher = await this.voucherModel.findByIdAndDelete(id);

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return {
      success: true,
      message: 'Voucher permanently deleted successfully',
      data: {
        _id: voucher._id,
        code: voucher.code,
      },
    };
  }

  /**
   * Delete voucher (soft delete by deactivating) - deprecated, use toggleVoucherStatus
   */
  async delete(id: string) {
    const voucher = await this.voucherModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true },
    );

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return { success: true, message: 'Voucher deleted successfully' };
  }

  /**
   * Get voucher users (who used the voucher)
   */
  async getVoucherUsers(voucherId: string) {
    const voucher = await this.voucherModel
      .findById(voucherId)
      .populate('usedBy', 'username email createdAt');

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return {
      code: voucher.code,
      totalUses: voucher.currentUses,
      maxUses: voucher.maxUses,
      users: voucher.usedBy,
    };
  }

  /**
   * Get user's voucher information
   */
  async getUserVoucherInfo(userId: any) {
    const voucher = await this.voucherModel.findOne({
      usedBy: userId,
    });

    if (!voucher) {
      return null;
    }

    return {
      voucherId: voucher._id,
      code: voucher.code,
      subscriptionType: voucher.subscriptionType,
      description: voucher.description,
      expiryDate: voucher.expiryDate,
      appliedAt: voucher.updatedAt,
    };
  }

  /**
   * Check if user has used a voucher
   */
  async hasUserUsedVoucher(userId: any): Promise<boolean> {
    const voucher = await this.voucherModel.findOne({
      usedBy: userId,
    });

    return !!voucher;
  }
}
