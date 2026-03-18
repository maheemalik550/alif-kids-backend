import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto, UpdateSettingDto, BulkCreateSettingDto, BulkUpdateSettingDto, SaveUpdateSettingsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreate(@Body() bulkCreateSettingDto: BulkCreateSettingDto) {
    return this.settingsService.bulkCreate(bulkCreateSettingDto);
  }

  @Patch('bulk')
  @HttpCode(HttpStatus.OK)
  async bulkUpdate(@Body() bulkUpdateSettingDto: BulkUpdateSettingDto) {
    return this.settingsService.bulkUpdate(bulkUpdateSettingDto);
  }

  @Post('save-or-update')
  @HttpCode(HttpStatus.OK)
  async saveOrUpdateSettings(@Body() saveUpdateSettingsDto: SaveUpdateSettingsDto) {
    return this.settingsService.saveOrUpdateSettings(saveUpdateSettingsDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.settingsService.findAll();
  }

  @Get('module/:moduleName')
  @HttpCode(HttpStatus.OK)
  async findByModule(@Param('moduleName') moduleName: string) {
    return this.settingsService.findByModule(moduleName);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.settingsService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSettingDto,
  ) {
    return this.settingsService.update(id, updateSettingDto);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  async deactivate(@Param('id') id: string) {
    return this.settingsService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return this.settingsService.delete(id);
  }

  @Post('admin/reset-indexes')
  @HttpCode(HttpStatus.OK)
  async resetIndexes() {
    if (process.env.NODE_ENV !== 'development') {
      return { message: 'This endpoint is only available in development mode' };
    }
    return this.settingsService.resetIndexes();
  }
}
