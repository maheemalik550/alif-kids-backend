import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BookMetaService } from './book-meta.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBookAgeDto } from './dto/create-book-age.dto';
import { UpdateBookAgeDto } from './dto/update-book-age.dto';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { CreateBookTypeDto } from './dto/create-book-type.dto';
import { UpdateBookTypeDto } from './dto/update-book-type.dto';
import { CreatePopularBookDto } from './dto/create-popular-book.dto';

@Controller('book-meta')
export class BookMetaController {
  constructor(private readonly bookMetaService: BookMetaService) {}

  @Get('popular-books')
  getPopularBooks() {
    return this.bookMetaService.listAges();
  }

  @Post('popular-books')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createPopularBooks(@Body() dto: CreatePopularBookDto) {
    return this.bookMetaService.createPopularBooks(dto);
  }



  @Get('ages')
  listAges() {
    return this.bookMetaService.listAges();
  }

  @Post('ages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createAge(@Body() dto: CreateBookAgeDto) {
    return this.bookMetaService.createAge(dto);
  }

  @Patch('ages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateAge(@Param('id') id: string, @Body() dto: UpdateBookAgeDto) {
    return this.bookMetaService.updateAge(id, dto);
  }

  @Delete('ages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteAge(@Param('id') id: string) {
    return this.bookMetaService.deleteAge(id);
  }

  @Get('categories')
  listCategories() {
    return this.bookMetaService.listCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createCategory(@Body() dto: CreateBookCategoryDto) {
    return this.bookMetaService.createCategory(dto);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateBookCategoryDto) {
    return this.bookMetaService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteCategory(@Param('id') id: string) {
    return this.bookMetaService.deleteCategory(id);
  }


  @Get('types')
  listTypes() {
    return this.bookMetaService.listTypes();
  }

  @Post('types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createType(@Body() dto: CreateBookTypeDto) {
    return this.bookMetaService.createType(dto);
  }

  @Patch('types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateType(@Param('id') id: string, @Body() dto: UpdateBookTypeDto) {
    return this.bookMetaService.updateType(id, dto);
  }

  @Delete('types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteType(@Param('id') id: string) {
    return this.bookMetaService.deleteType(id);
  }

  @Get('languages')
  listLanguages() {
    return this.bookMetaService.getLanguages();
  }
}
