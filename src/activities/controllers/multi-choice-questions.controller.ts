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
  Query,
} from '@nestjs/common';
import { MultiChoiceQuestionsService } from '../services';
import {
  CreateMultiChoiceQuestionDto,
  UpdateMultiChoiceQuestionDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('activities/multi-choice-questions')
@UseGuards(JwtAuthGuard)
export class MultiChoiceQuestionsController {
  constructor(private readonly service: MultiChoiceQuestionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateMultiChoiceQuestionDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateMultiChoiceQuestionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get(':id/related')
  @HttpCode(HttpStatus.OK)
  getRelatedActivities(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.service.getRelatedActivities(id, parseInt(limit, 10));
  }

  @Get(':id/similar')
  @HttpCode(HttpStatus.OK)
  getSimilarActivities(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.service.getSimilarActivities(id, parseInt(limit, 10));
  }
}
