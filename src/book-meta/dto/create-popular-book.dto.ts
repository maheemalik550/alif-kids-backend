import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePopularBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  image?: string;
}
