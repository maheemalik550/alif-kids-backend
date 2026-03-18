import { IsOptional, IsArray, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterEpisodesDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAge?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAge?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  values?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  series?: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
