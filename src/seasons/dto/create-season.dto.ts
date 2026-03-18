import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inActive',
}

export class CreateSeasonDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  name: string;

  @IsEnum(StatusEnum, { message: 'Status must be either "active" or "inActive"' })
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty({ message: 'Series ID is required' })
  seriesId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Season number is required' })
  seasonNumber: number;

  @IsNumber()
  @IsOptional()
  episodes?: number;

  @IsString()
  @IsOptional()
  icon?: string;
}
