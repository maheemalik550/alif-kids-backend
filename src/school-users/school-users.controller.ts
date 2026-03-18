import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SchoolUsersService } from './school-users.service';
import { CreateSchoolUserDto } from './dto/create-school-user.dto';
import { UpdateSchoolUserDto } from './dto/update-school-user.dto';
import { FilterSchoolUserDto } from './dto/filter-school-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('school-users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SchoolUsersController {
  constructor(private readonly schoolUsersService: SchoolUsersService) {}

  @Post()
  create(@Body() dto: CreateSchoolUserDto) { return this.schoolUsersService.create(dto); }

  @Get()
  findAll(@Query() dto: FilterSchoolUserDto) { return this.schoolUsersService.findAll(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSchoolUserDto) { return this.schoolUsersService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.schoolUsersService.remove(id); }
}
