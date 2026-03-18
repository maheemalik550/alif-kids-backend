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

class PhotoItemDto {
  @IsString()
  image: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsOptional()
  @IsString()
  _id?: string;
}

class PhotoPairDto {
  @IsString()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoItemDto)
  items: PhotoItemDto[];
}

export class CreatePhotoMatchDto {
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
  @Type(() => PhotoPairDto)
  pairs?: PhotoPairDto[];

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}

export class UpdatePhotoMatchDto {
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
  @Type(() => PhotoPairDto)
  pairs?: PhotoPairDto[];
}
