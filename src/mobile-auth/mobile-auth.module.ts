import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MobileAuthService } from './mobile-auth.service';
import { MobileAuthController } from './mobile-auth.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [MobileAuthController],
  providers: [MobileAuthService],
  exports: [MobileAuthService],
})
export class MobileAuthModule {}
