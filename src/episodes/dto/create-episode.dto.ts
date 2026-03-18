import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsUrl,
  ValidateIf,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inActive',
}

export class CreateEpisodeDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  name: string;

  @IsEnum(StatusEnum, { message: 'Status must be either "active" or "inActive"' })
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty({ message: 'Season ID is required' })
  seasonId: string;

  @IsString()
  @IsNotEmpty({ message: 'Series ID is required' })
  seriesId: string;

  @IsArray({ message: 'Age must be an array' })
  @ArrayMinSize(2, { message: 'Age must have exactly 2 numbers [min, max]' })
  @ArrayMaxSize(2, { message: 'Age must have exactly 2 numbers [min, max]' })
  @IsNumber({}, { each: true, message: 'Age values must be numbers' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Age range is required' })
  age: [number, number];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  values?: string[];

  @IsNumber()
  @IsNotEmpty({ message: 'Episode number is required' })
  episodeNumber: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsString()
  @IsOptional()
  talkingPoints: string;

  @IsString()
  @IsOptional()
  notes: string;

  @IsString()
  @IsOptional()
  forParentsAndTeachers: string;

  @IsObject()
  @IsOptional()
  dynamicFields?: Record<string, any>;
}
