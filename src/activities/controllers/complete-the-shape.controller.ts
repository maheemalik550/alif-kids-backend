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
import { CompleteTheShapeService } from '../services';
import { CreateCompleteTheShapeDto, UpdateCompleteTheShapeDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('activities/complete-the-shape')
@UseGuards(JwtAuthGuard)
export class CompleteTheShapeController {
  constructor(private readonly service: CompleteTheShapeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCompleteTheShapeDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCompleteTheShapeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
