import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { VouchersModule } from '../vouchers/vouchers.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { UserOtp, UserOtpSchema } from './schemas/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserOtp.name, schema: UserOtpSchema },

    ]),
    VouchersModule,
    ProfilesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
