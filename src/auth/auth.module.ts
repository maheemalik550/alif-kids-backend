import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { VouchersModule } from '../vouchers/vouchers.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    VouchersModule,
    ProfilesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
