import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { AudiosService } from './audios.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { FilterAudiosDto } from './dto/filter-audios.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('audios')
export class AudiosController {
  constructor(private readonly audiosService: AudiosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAudioDto: CreateAudioDto, @Request() req: any) {
    return this.audiosService.create(createAudioDto, req.user?.id);
  }

  @Get()
  findAll(@Query() filterDto: FilterAudiosDto) { return this.audiosService.findAll(filterDto); }

  @Get('episode/:episodeId')
  findByEpisodeId(@Param('episodeId') episodeId: string, @Query() filterDto: FilterAudiosDto) { return this.audiosService.findByEpisodeId(episodeId, filterDto); }

  @Get('season/:seasonId')
  findBySeasonId(@Param('seasonId') seasonId: string, @Query() filterDto: FilterAudiosDto) { return this.audiosService.findBySeasonId(seasonId, filterDto); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.audiosService.findOne(id); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateDto: UpdateAudioDto) { return this.audiosService.update(id, updateDto); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) { return this.audiosService.remove(id); }
}
