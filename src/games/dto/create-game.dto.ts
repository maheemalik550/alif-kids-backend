import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
  IsMongoId,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateGameDto {
  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  tagline: string;

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
  genre: string;

  @IsString()
  @IsOptional()
  series: string;

  @IsString()
  @IsOptional()
  game_url: string;

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  peakinside: string[];

  @IsNumber()
  @IsOptional()
  order: number;

  @IsMongoId()
  @IsOptional()
  episodeId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  seasonId?: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  createdBy: Types.ObjectId;

  @IsObject()
  @IsOptional()
  dynamicFields?: Record<string, any>;
}
