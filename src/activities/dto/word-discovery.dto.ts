import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MatrixCellDto {
  @IsString()
  ch: string;

  @IsBoolean()
  fixed: boolean;
}

export class PathCoordinateDto {
  @IsNumber()
  row: number;

  @IsNumber()
  col: number;
}

export class WordDto {
  @IsString()
  word: string;

  @IsString()
  direction: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PathCoordinateDto)
  path: PathCoordinateDto[];

  @IsArray()
  @IsString({ each: true })
  coordinates: string[];
}

export class CreateWordDiscoveryDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsMongoId()
  surahId?: string;

  @IsMongoId()
  episodeId: string;

  @IsMongoId()
  typeId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  gridSize?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatrixCellDto)
  matrix?: MatrixCellDto[][];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WordDto)
  words?: WordDto[];

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
  @IsNumber()
  weightage?: number;

  @IsOptional()
  @IsBoolean()
  isWeightage?: boolean;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdateWordDiscoveryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsMongoId()
  surahId?: string;

  @IsOptional()
  @IsMongoId()
  episodeId?: string;

  @IsOptional()
  @IsMongoId()
  typeId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  gridSize?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatrixCellDto)
  matrix?: MatrixCellDto[][];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WordDto)
  words?: WordDto[];

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
  @IsNumber()
  weightage?: number;

  @IsOptional()
  @IsBoolean()
  isWeightage?: boolean;
}
