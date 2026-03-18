import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  price: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsString()
  ctaLabel: string;

  @IsString()
  alreadySubscribed: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
