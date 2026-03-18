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
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FilterGamesDto } from './dto/filter-games.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGameDto: CreateGameDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.gamesService.create(createGameDto, userId);
  }

  @Get()
  findAll(@Query() filterGamesDto: FilterGamesDto) {
    return this.gamesService.findAll(filterGamesDto);
  }

  @Get('episode/:episodeId')
  findByEpisodeId(
    @Param('episodeId') episodeId: string,
    @Query() filterGamesDto: FilterGamesDto,
  ) {
    return this.gamesService.findByEpisodeId(episodeId, filterGamesDto);
  }


  @Get('season/:seasonId')
  findBySeasonId(
    @Param('seasonId') seasonId: string,
    @Query() filterGamesDto: FilterGamesDto,
  ) {
    return this.gamesService.findBySeasonId(seasonId, filterGamesDto);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.gamesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Get(':id/related')
  getRelatedContent(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.gamesService.getRelatedContent(id, parseInt(limit, 10));
  }

  @Get(':id/similar')
  getSimilarContent(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.gamesService.getSimilarContent(id, parseInt(limit, 10));
  }
}
