import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateActivityTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  img: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdateActivityTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}
