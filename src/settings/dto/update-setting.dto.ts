import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  ArrayMinSize,
} from 'class-validator';
import { FieldType, ModuleEnum } from '../enums';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSettingDto } from './create-setting.dto';

export class UpdateSettingDto extends PartialType(CreateSettingDto) {
  @IsString()
  @IsOptional()
  label?: string;

  @IsEnum(FieldType)
  @IsOptional()
  fieldType?: FieldType;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(ModuleEnum, { each: true })
  @IsOptional()
  modules?: string[];

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  order?: number;

  @IsString()
  @IsOptional()
  placeholder?: string;

  @IsOptional()
  defaultValue?: any;

  @IsObject()
  @IsOptional()
  validationRules?: Record<string, any>;
}
