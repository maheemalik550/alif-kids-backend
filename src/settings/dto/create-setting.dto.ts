import {
  IsString,
  IsNotEmpty,
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

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  fieldKey: string;

  @IsEnum(FieldType)
  @IsNotEmpty()
  fieldType: FieldType;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(ModuleEnum, { each: true })
  @IsNotEmpty()
  modules: string[];

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
