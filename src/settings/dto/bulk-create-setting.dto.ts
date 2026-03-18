import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSettingDto } from './create-setting.dto';

export class BulkCreateSettingDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSettingDto)
  settings: CreateSettingDto[];
}
