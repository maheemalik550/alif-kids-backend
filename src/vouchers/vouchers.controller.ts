import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  /**
   * Create a new voucher (Admin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVoucherDto: CreateVoucherDto) {
    return await this.vouchersService.create(createVoucherDto);
  }

  /**
   * Validate a voucher code
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateVoucher(@Body() validateVoucherDto: ValidateVoucherDto) {
    return await this.vouchersService.validateVoucher(validateVoucherDto);
  }

  /**
   * Get all vouchers (Admin only)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('isActive') isActive?: boolean,
    @Query('code') code?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ) {
    return await this.vouchersService.findAll({
      isActive: isActive === undefined ? undefined : isActive === true,
      code,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  /**
   * Get voucher by ID (Admin only)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findById(@Param('id') id: string) {
    return await this.vouchersService.findById(id);
  }

  /**
   * Update voucher (Admin only)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return await this.vouchersService.update(id, updateVoucherDto);
  }

  /**
   * Toggle voucher status (activate/deactivate) (Admin only)
   */
  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async toggleVoucherStatus(@Param('id') id: string) {
    return await this.vouchersService.toggleVoucherStatus(id);
  }

  /**
   * Permanently delete voucher (Admin only)
   */
  @Delete(':id/permanent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async hardDelete(@Param('id') id: string) {
    return await this.vouchersService.hardDelete(id);
  }

  /**
   * Delete/Deactivate voucher (Admin only) - kept for backward compatibility
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return await this.vouchersService.delete(id);
  }

  /**
   * Get users who used a specific voucher (Admin only)
   */
  @Get(':id/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getVoucherUsers(@Param('id') id: string) {
    return await this.vouchersService.getVoucherUsers(id);
  }
}
