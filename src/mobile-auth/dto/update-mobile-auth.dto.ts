import { IsString, IsOptional } from 'class-validator';

export class UpdateMobileAuthDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  inAppUserId?: string;

  @IsOptional()
  premiumSubscription?: boolean;

  @IsOptional()
  isAccountDeleted?: boolean;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsOptional()
  isRegistered?: boolean;

  @IsString()
  @IsOptional()
  purchaseInfo?: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsString()
  @IsOptional()
  appVersion?: string;

  @IsString()
  @IsOptional()
  osType?: string;

  @IsOptional()
  lastLoginAt?: Date;

  @IsString()
  @IsOptional()
  registrationToken?: string;
}
