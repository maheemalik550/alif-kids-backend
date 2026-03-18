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

class KabahPartDto {
  @IsString()
  partName: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  pattern?: string;
}

export class CreateFillTheKabahDto {
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
  @Type(() => KabahPartDto)
  kabahParts?: KabahPartDto[];

  @IsOptional()
  @IsString()
  templateImageUrl?: string;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdateFillTheKabahDto {
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
  @Type(() => KabahPartDto)
  kabahParts?: KabahPartDto[];

  @IsOptional()
  @IsString()
  templateImageUrl?: string;
}
