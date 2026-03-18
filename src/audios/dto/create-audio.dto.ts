import {
  IsString,
  IsNotEmpty,
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

export class CreateAudioDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  tagline: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  series: string;

  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @IsString()
  @IsOptional()
  cover_image: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsNumber()
  @IsOptional()
  duration: number;

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
