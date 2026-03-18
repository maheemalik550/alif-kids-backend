import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateFillTheColorDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  saveAsDraft?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsMongoId()
  episodeId: string;

  @IsOptional()
  @IsNumber()
  weightage?: number;

  @IsOptional()
  @IsBoolean()
  isWeightage?: boolean;

  @IsMongoId()
  typeId: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  regions?: Array<{
    id: string;
    color?: string;
    label?: string;
  }>;

  @IsOptional()
  @IsArray()
  colorPalette?: string[];

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsArray()
  items?: any[];
}

export class UpdateFillTheColorDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  saveAsDraft?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsMongoId()
  episodeId?: string;

  @IsOptional()
  @IsNumber()
  weightage?: number;

  @IsOptional()
  @IsBoolean()
  isWeightage?: boolean;

  @IsOptional()
  @IsMongoId()
  typeId?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  regions?: Array<{
    id: string;
    color?: string;
    label?: string;
  }>;

  @IsOptional()
  @IsArray()
  colorPalette?: string[];

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsArray()
  items?: any[];
}
