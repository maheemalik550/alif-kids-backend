import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateVersionDto {
  @IsString()
  name: string;

  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  iosBuildVersion?: string;

  @IsString()
  @IsOptional()
  androidBuildVersion?: string;

  @IsNumber()
  @IsOptional()
  iosVersionNumber?: number;

  @IsNumber()
  @IsOptional()
  androidVersionNumber?: number;

  @IsBoolean()
  @IsOptional()
  forceInstall?: boolean;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsEnum(['ios', 'android', 'both'])
  platform: string;
}

export class UpdateVersionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  iosBuildVersion?: string;

  @IsString()
  @IsOptional()
  androidBuildVersion?: string;

  @IsNumber()
  @IsOptional()
  iosVersionNumber?: number;

  @IsNumber()
  @IsOptional()
  androidVersionNumber?: number;

  @IsBoolean()
  @IsOptional()
  forceInstall?: boolean;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsEnum(['ios', 'android', 'both'])
  @IsOptional()
  platform?: string;
}
