import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
