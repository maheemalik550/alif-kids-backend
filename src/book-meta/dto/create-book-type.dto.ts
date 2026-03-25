import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
