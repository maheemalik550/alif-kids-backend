import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createStudentDto: CreateStudentDto): Promise<any> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(@Query() filterStudentDto: FilterStudentDto): Promise<any> {
    return this.studentsService.findAll(filterStudentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto): Promise<any> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string): Promise<any> {
    return this.studentsService.remove(id);
  }
}
