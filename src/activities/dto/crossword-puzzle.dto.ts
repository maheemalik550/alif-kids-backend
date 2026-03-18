import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CrosswordCellDto {
  @IsBoolean()
  isPattern: boolean;

  @IsOptional()
  @IsString()
  alphabet?: string;

  @IsOptional()
  @IsArray()
  referenceNo?: number[];

  @IsOptional()
  @IsArray()
  wordReference?: number[];

  @IsOptional()
  @IsString()
  referenceHeading?: string;

  @IsOptional()
  @IsString()
  referenceDesc?: string;
}

class ReferenceDto {
  @IsString()
  word: string;

  @IsString()
  referenceHeading: string;

  @IsString()
  referenceDesc: string;

  @IsArray()
  clueNumbers: number[];

  @IsNumber()
  clueNumber: number;
}


export class CreateCrosswordPuzzleDto {
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrosswordCellDto)
  crosswordPuzzleMatrix?: CrosswordCellDto[][];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceDto)
  references?: ReferenceDto[];

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}


export class UpdateCrosswordPuzzleDto {
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrosswordCellDto)
  crosswordPuzzleMatrix?: CrosswordCellDto[][];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceDto)
  references?: ReferenceDto[];
}
