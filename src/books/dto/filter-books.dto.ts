import { IsOptional, IsArray, IsString, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterBooksDto {
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
  @IsString()
  series?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isTrending?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isRecommended?: boolean;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  ageGroupId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  categoryIds?: string[];

  @IsOptional()
  @IsString()
  typeId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  values?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  series_list?: string[];

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
  sortBy?: string = 'order';

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}
