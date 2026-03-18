import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inActive',
}

export class CreateSeriesDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  name: string;

  @IsEnum(StatusEnum, { message: 'Status must be either "active" or "inActive"' })
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty({ message: 'Owner is required' })
  owner: string;

  @IsNumber()
  @IsOptional()
  seasons?: number;

  @IsNumber()
  @IsOptional()
  episodes?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
