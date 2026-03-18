import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsUrl,
  IsArray,
} from 'class-validator';

export class CreateMazeGameDto {
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
  type?: string;

  @IsOptional()
  start?: { row: number; col: number };

  @IsOptional()
  end?: { row: number; col: number };

  @IsOptional()
  @IsArray()
  matrix?: number[][];

  @IsOptional()
  @IsUrl()
  characterImg?: string;

  @IsOptional()
  @IsUrl()
  endImg?: string;

  @IsOptional()
  @IsUrl()
  wallImage?: string;

  @IsOptional()
  @IsUrl()
  pathImg?: string;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}


export class UpdateMazeGameDto {
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
  type?: string;

  @IsOptional()
  start?: { row: number; col: number };

  @IsOptional()
  end?: { row: number; col: number };

  @IsOptional()
  @IsArray()
  matrix?: number[][];

  @IsOptional()
  @IsUrl()
  characterImg?: string;

  @IsOptional()
  @IsUrl()
  endImg?: string;

  @IsOptional()
  @IsUrl()
  wallImage?: string;

  @IsOptional()
  @IsUrl()
  pathImg?: string;
}

