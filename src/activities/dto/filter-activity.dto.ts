import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterActivityDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  activityType?: string; // Filter by specific activity type (e.g., 'MultiChoiceQuestion')

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
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  series_list?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  values?: string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

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
