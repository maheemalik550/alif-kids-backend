import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FilterVideosDto } from './dto/filter-videos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVideoDto: CreateVideoDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.videosService.create(createVideoDto, userId);
  }

  @Get()
  findAll(@Query() filterVideosDto: FilterVideosDto) {
    return this.videosService.findAll(filterVideosDto);
  }

  @Get('episode/:episodeId')
  findByEpisodeId(
    @Param('episodeId') episodeId: string,
    @Query() filterVideosDto: FilterVideosDto,
  ) {
    return this.videosService.findByEpisodeId(episodeId, filterVideosDto);
  }

  @Get('season/:seasonId')
  findBySeasonId(
    @Param('seasonId') seasonId: string,
    @Query() filterVideosDto: FilterVideosDto,
  ) {
    return this.videosService.findBySeasonId(seasonId, filterVideosDto);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.videosService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }

  @Get(':id/related')
  getRelatedContent(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.videosService.getRelatedContent(id, parseInt(limit, 10));
  }

  @Get(':id/similar')
  getSimilarContent(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.videosService.getSimilarContent(id, parseInt(limit, 10));
  }
}
