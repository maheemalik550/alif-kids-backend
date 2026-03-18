import { IsArray, ArrayMinSize, ValidateNested, IsString, IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSettingDto } from './update-setting.dto';

export class BulkUpdateItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateSettingDto)
  data: UpdateSettingDto;
}

export class BulkUpdateSettingDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateItemDto)
  updates: BulkUpdateItemDto[];
}
