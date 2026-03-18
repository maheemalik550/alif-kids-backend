import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { FilterSchoolDto } from './dto/filter-school.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createSchoolDto: CreateSchoolDto): Promise<any> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  findAll(@Query() filterSchoolDto: FilterSchoolDto): Promise<any> {
    return this.schoolsService.findAll(filterSchoolDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto): Promise<any> {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string): Promise<any> {
    return this.schoolsService.remove(id);
  }
}
