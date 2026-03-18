import { IsOptional, IsString, IsBoolean, MinLength, MaxLength, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  profileName?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsBoolean()
  isKidsProfile?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  pin?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;
}
