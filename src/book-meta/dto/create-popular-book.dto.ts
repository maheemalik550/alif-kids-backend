import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePopularBookDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
