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
import { MultiAnswerShortQAService } from '../services';
import {
  CreateMultiAnswerShortQADto,
  UpdateMultiAnswerShortQADto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('activities/multi-answer-short-qa')
@UseGuards(JwtAuthGuard)
export class MultiAnswerShortQAController {
  constructor(private readonly service: MultiAnswerShortQAService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMultiAnswerShortQADto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateMultiAnswerShortQADto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
