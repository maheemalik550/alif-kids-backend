import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';
import { VouchersHelper } from './vouchers.helper';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Voucher.name, schema: VoucherSchema },
    ]),
  ],
  controllers: [VouchersController],
  providers: [VouchersService, VouchersHelper],
  exports: [VouchersService, VouchersHelper],
})
export class VouchersModule {}
