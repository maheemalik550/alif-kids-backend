import type { File } from 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { FilterEpisodesDto } from './dto/filter-episodes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createEpisodeDto: CreateEpisodeDto) {
    return this.episodesService.create(createEpisodeDto);
  }

  @Post(':id/upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadEpisodeImage(
    @Param('id') id: string,
    @UploadedFile() file: File,
  ) {
    return this.episodesService.uploadEpisodeImage(id, file);
  }

  @Get()
  async findAll(@Query() filterEpisodesDto: FilterEpisodesDto) {
    return this.episodesService.findAll(filterEpisodesDto);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'user')
  findOne(@Param('id') id: string) {
    return this.episodesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateEpisodeDto: UpdateEpisodeDto) {
    return this.episodesService.update(id, updateEpisodeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.episodesService.remove(id);
  }

  @Get(':id/similar')
  getSimilarEpisodes(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.episodesService.getSimilarEpisodes(id, parseInt(limit, 10));
  }

  @Get(':id/related')
  getTrendingRelatedEpisodes(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.episodesService.getTrendingRelatedEpisodes(id, parseInt(limit, 10));
  }
}
