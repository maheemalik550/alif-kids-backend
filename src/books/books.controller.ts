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
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBookDto: CreateBookDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.booksService.create(createBookDto, userId);
  }

  @Get()
  findAll(@Query() filterBooksDto: FilterBooksDto) {
    return this.booksService.findAll(filterBooksDto);
  }

  @Get('episode/:episodeId')
  findByEpisodeId(
    @Param('episodeId') episodeId: string,
    @Query() filterBooksDto: FilterBooksDto,
  ) {
    return this.booksService.findByEpisodeId(episodeId, filterBooksDto);
  }

  @Get('season/:seasonId')
  findBySeasonId(
    @Param('seasonId') seasonId: string,
    @Query() filterBooksDto: FilterBooksDto,
  ) {
    return this.booksService.findBySeasonId(seasonId, filterBooksDto);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.booksService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Get(':id/related')
  getRelatedContent(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.booksService.getRelatedContent(id, parseInt(limit, 10));
  }

  @Get(':id/similar')
  getSimilarContent(
    @Param('id') id: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.booksService.getSimilarContent(id, parseInt(limit, 10));
  }
}
