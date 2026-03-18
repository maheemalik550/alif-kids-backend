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

class HiddenWordDto {
  @IsString()
  originalWord: string;

  @IsNumber()
  position: number;
}

export class CreateFillInTheBlanksDto {
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
  paragraphText?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HiddenWordDto)
  hiddenWords?: HiddenWordDto[];

  @IsOptional()
  @IsString()
  displayText?: string;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdateFillInTheBlanksDto {
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
  paragraphText?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HiddenWordDto)
  hiddenWords?: HiddenWordDto[];

  @IsOptional()
  @IsString()
  displayText?: string;
}
