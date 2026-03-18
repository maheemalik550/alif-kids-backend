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
import { PrintablesService } from './printables.service';
import { CreatePrintableDto } from './dto/create-printable.dto';
import { UpdatePrintableDto } from './dto/update-printable.dto';
import { FilterPrintablesDto } from './dto/filter-printables.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('printables')
export class PrintablesController {
  constructor(private readonly printablesService: PrintablesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPrintableDto: CreatePrintableDto, @Request() req: any) {
    const userId = req.user?.id;
    return this.printablesService.create(createPrintableDto, userId);
  }

  @Get()
  findAll(@Query() filterPrintablesDto: FilterPrintablesDto) {
    return this.printablesService.findAll(filterPrintablesDto);
  }

  @Get('episode/:episodeId')
  findByEpisodeId(
    @Param('episodeId') episodeId: string,
    @Query() filterPrintablesDto: FilterPrintablesDto,
  ) {
    return this.printablesService.findByEpisodeId(episodeId, filterPrintablesDto);
  }


  @Get('season/:seasonId')
  findBySeasonId(
    @Param('seasonId') seasonId: string,
    @Query() filterPrintablesDto: FilterPrintablesDto,
  ) {
    return this.printablesService.findBySeasonId(seasonId, filterPrintablesDto);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.printablesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printablesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updatePrintableDto: UpdatePrintableDto) {
    return this.printablesService.update(id, updatePrintableDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.printablesService.remove(id);
  }
}
