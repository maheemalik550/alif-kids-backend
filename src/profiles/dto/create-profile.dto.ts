import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  profileName: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsBoolean()
  isKidsProfile?: boolean;

  @IsOptional()
  @IsString()
  profileType?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  pin?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;
}
