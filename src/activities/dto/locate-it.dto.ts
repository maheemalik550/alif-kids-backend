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

class StepperDataDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNumber()
  row: number;

  @IsNumber()
  col: number;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  dropImg?: string;

  @IsOptional()
  @IsString()
  ansImg?: string;

  @IsBoolean()
  isMain: boolean;
}

class StepperDto {
  @IsString()
  question: string;

  @IsString()
  img: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepperDataDto)
  data: StepperDataDto[];
}

export class CreateLocateItDto {
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
  @Type(() => StepperDto)
  stepper?: StepperDto[];

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdateLocateItDto {
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
  @Type(() => StepperDto)
  stepper?: StepperDto[];
}
