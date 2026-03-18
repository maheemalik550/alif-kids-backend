import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookAgeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  minAge?: number;

  @IsOptional()
  @IsNumber()
  maxAge?: number;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
