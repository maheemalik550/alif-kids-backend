import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateMobileAuthDto {
  @IsNotEmpty({ message: 'App User ID is required' })
  @IsString({ each: true, message: 'Each App User ID must be a string' })
  @IsArray({ message: 'App User ID must be a string or array of strings' })
  inAppUserId: string | string[];

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsBoolean()
  @IsOptional()
  premiumSubscription?: boolean;

  @IsString()
  @IsOptional()
  appVersion?: string;

  @IsString()
  @IsOptional()
  osType?: string;

  @IsString()
  @IsOptional()
  registrationToken?: string;

  @IsBoolean()
  @IsOptional()
  isRegistered?: boolean;

  @IsString()
  @IsOptional()
  purchaseInfo?: string;

  @IsString()
  @IsOptional()
  role?: string;
}
