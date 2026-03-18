import { Injectable } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

/**
 * Helper utility for voucher operations
 * Provides convenient methods for commonly used voucher checks and operations
 */
@Injectable()
export class VouchersHelper {
  constructor(private vouchersService: VouchersService) {}

  /**
   * Check if a user has used a voucher for premium subscription
   * Useful for identifying users who availed premium via voucher
   */
  async hasUserUsedVoucherForPremium(userId: any): Promise<boolean> {
    return await this.vouchersService.hasUserUsedVoucher(userId);
  }

  /**
   * Get complete voucher information for a user
   * Returns null if user hasn't used any voucher
   */
  async getUserVoucherDetails(userId: any) {
    return await this.vouchersService.getUserVoucherInfo(userId);
  }

  /**
   * Validate if a voucher code is valid and can be used
   * Returns validation result without applying it
   */
  async isVoucherValid(voucherCode: string): Promise<boolean> {
    try {
      const result = await this.vouchersService.validateVoucher({
        code: voucherCode,
      });
      return result.isValid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get detailed information about a specific voucher
   * Useful for admin dashboards and reporting
   */
  async getVoucherStats(voucherId: string) {
    const voucher = await this.vouchersService.findById(voucherId);
    const usagePercentage =
      (voucher.currentUses / voucher.maxUses) * 100 || 0;
    const isExpired = new Date(voucher.expiryDate) <= new Date();
    const daysUntilExpiry = Math.ceil(
      (new Date(voucher.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return {
      code: voucher.code,
      status: isExpired ? 'expired' : 'active',
      usagePercentage,
      currentUses: voucher.currentUses,
      maxUses: voucher.maxUses,
      daysUntilExpiry: isExpired ? 0 : daysUntilExpiry,
      usedBy: voucher.usedBy.length,
      description: voucher.description,
      createdAt: voucher.createdAt,
    };
  }

  /**
   * Get all active vouchers (useful for frontend listings)
   */
  async getActiveCoupons() {
    return await this.vouchersService.findAll({
      isActive: true,
    });
  }

  /**
   * Search vouchers by code (partial match)
   */
  async searchVouchers(codePattern: string) {
    return await this.vouchersService.findAll({
      code: codePattern,
    });
  }
}
