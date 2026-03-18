import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VersionService } from './version.service';
import { CreateVersionDto, UpdateVersionDto } from './dto/version.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createVersionDto: CreateVersionDto,
    @CurrentUser() user: any,
  ) {
    const version = await this.versionService.create(createVersionDto, user.id);
    return { status: 1, data: version };
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const versions = await this.versionService.findAll();
    return { status: 1, data: versions };
  }

  @Get('current')
  async getCurrentVersion() {
    const version = await this.versionService.getCurrentVersion();
    return { status: 1, data: version };
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateVersionDto: UpdateVersionDto,
    @CurrentUser() user: any,
  ) {
    const version = await this.versionService.update(
      id,
      updateVersionDto,
      user.id,
    );

    if (!version) {
      return {
        status: 0,
        message: 'Version not found',
      };
    }

    return {
      status: 1,
      message: 'Version updated successfully',
      data: version,
    };
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    const version = await this.versionService.remove(id);

    if (!version) {
      return {
        status: 0,
        message: 'Version not found',
      };
    }

    return {
      status: 1,
      message: 'Version permanently deleted',
    };
  }
}
