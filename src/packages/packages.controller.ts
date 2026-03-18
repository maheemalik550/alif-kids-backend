import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  /**
   * Create a new package (Admin only)
   * POST /packages
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPackageDto: CreatePackageDto) {
    return await this.packagesService.create(createPackageDto);
  }

  /**
   * Get all packages (Public)
   * GET /packages
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('isActive') isActive?: boolean,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    return await this.packagesService.findAll({
      isActive: isActive === undefined ? true : isActive === true,
      limit,
      skip,
    });
  }

  /**
   * Get a specific package by MongoDB ID (Admin only)
   * GET /packages/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    return await this.packagesService.findById(id);
  }

  /**
   * Update a package (Admin only)
   * PUT /packages/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return await this.packagesService.update(id, updatePackageDto);
  }

  /**
   * Partial update a package (Admin only)
   * PATCH /packages/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async partialUpdate(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return await this.packagesService.update(id, updatePackageDto);
  }

  /**
   * Delete a package (Admin only)
   * DELETE /packages/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.packagesService.delete(id);
  }

  /**
   * Toggle package active status (Admin only)
   * PATCH /packages/:id/toggle-status
   */
  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async toggleActive(@Param('id') id: string) {
    return await this.packagesService.toggleActive(id);
  }
}
