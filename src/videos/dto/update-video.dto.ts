import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsMongoId,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateVideoDto {
  @IsString()
  @IsOptional()
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
  @IsOptional()
  age: [number, number];

  @IsNumber()
  @IsOptional()
  price_gbp: number;

  @IsString()
  @IsOptional()
  format: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  series: string;

  @IsString()
  @IsOptional()
  videoUrl: string;

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
  cover_image: string;

  @IsNumber()
  @IsOptional()
  duration: number;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsNumber()
  @IsOptional()
  order: number;

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

  @IsMongoId()
  @IsOptional()
  seasonId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  episodeId?: Types.ObjectId;

  @IsObject()
  @IsOptional()
  dynamicFields?: Record<string, any>;
}
