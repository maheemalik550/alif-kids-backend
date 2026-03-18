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

class ActivityStepDto {
  @IsNumber()
  stepNumber: number;

  @IsString()
  instruction: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateHandsOnActivityDto {
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
  @Type(() => ActivityStepDto)
  steps?: ActivityStepDto[];

  @IsOptional()
  @IsArray()
  materials?: string[];

  @IsOptional()
  @IsArray()
  objectives?: string[];

  @IsOptional()
  @IsBoolean()
  isMediaFlag?: boolean;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdateHandsOnActivityDto {
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
  @Type(() => ActivityStepDto)
  steps?: ActivityStepDto[];

  @IsOptional()
  @IsArray()
  materials?: string[];

  @IsOptional()
  @IsArray()
  objectives?: string[];

  @IsOptional()
  @IsBoolean()
  isMediaFlag?: boolean;
}
