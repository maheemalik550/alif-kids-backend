import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DynamicOrderBlanksService } from '../services';
import {
  CreateDynamicOrderBlanksDto,
  UpdateDynamicOrderBlanksDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('activities/dynamic-order-blanks')
@UseGuards(JwtAuthGuard)
export class DynamicOrderBlanksController {
  constructor(private readonly service: DynamicOrderBlanksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDynamicOrderBlanksDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('episode/:episodeId')
  findByEpisodeId(@Param('episodeId') episodeId: string) {
    return this.service.findByEpisodeId(episodeId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDynamicOrderBlanksDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
