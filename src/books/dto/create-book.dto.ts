import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsUrl,
  IsBoolean,
  IsMongoId,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateBookDto {
  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  tagline: string;

  @IsString()
  @IsOptional()
  isbn: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsNotEmpty()
  age: [number, number];

  @IsNumber()
  @IsOptional()
  price_gbp: number;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'bookUrl must be a valid URL' })
  bookUrl: string;

  @IsString()
  @IsOptional()
  series: string;

  @IsString()
  @IsOptional()
  product_url: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsString()
  @IsOptional()
  learning_notes: string;

  @IsString()
  @IsOptional()
  islamic_references: string;

  @IsString()
  @IsOptional()
  for_parents_teachers: string;

  @IsString()
  @IsOptional()
  featuredImage: string;

  @IsString()
  @IsOptional()
  cover_image: string;

  @IsString()
  @IsOptional()
  bookView: string;

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  @IsString()
  @IsOptional()
  language?: string;

  @IsMongoId()
  @IsOptional()
  ageGroupId?: Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  categoryIds?: Types.ObjectId[];

  @IsMongoId()
  @IsOptional()
  typeId?: Types.ObjectId;

  @IsArray()
  @IsOptional()
  pages: any[];

  @IsBoolean()
  @IsOptional()
  saveAsDraft: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsBoolean()
  @IsOptional()
  isPremium: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  values: string[];

  @IsNumber()
  @IsOptional()
  order: number;

  @IsMongoId()
  @IsOptional()
  seasonId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  episodeId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  createdBy: Types.ObjectId;

  @IsObject()
  @IsOptional()
  dynamicFields?: Record<string, any>;
}
