import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum OSType {
  IOS = 'iOS',
  ANDROID = 'Android',
  WEB = 'Web',
}

export class CheckMobileUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Device ID is required' })
  @MinLength(5, { message: 'Device ID must be at least 5 characters' })
  @MaxLength(255, { message: 'Device ID must not exceed 255 characters' })
  deviceId: string;

  @IsString()
  @IsOptional()
  inAppUserId?: string;

  @IsString()
  @IsOptional()
  appVersion?: string;

  @IsEnum(OSType)
  @IsOptional()
  osType?: OSType;
}
