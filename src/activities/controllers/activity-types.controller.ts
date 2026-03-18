import type { File } from 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivityTypesService } from '../services';
import { CreateActivityTypeDto, UpdateActivityTypeDto, FilterActivityDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@Controller('activities/types')
export class ActivityTypesController {
  constructor(private readonly service: ActivityTypesService) {}

  // ============ ACTIVITY TYPES CRUD ============

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateActivityTypeDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async uploadImage(@UploadedFile() file: File, @CurrentUser() user: any) {
    return this.service.uploadActivityImage(file, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  /**
   * Get all available activities regardless of episode and userId
   * GET /activities/types/all-available
   * 
   * Query parameters:
   * - search: Search in title, name, and description
   * - activityType: Filter by specific activity type (e.g., 'MultiChoiceQuestion')
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10)
   * - sortBy: Field to sort by (default: 'createdAt')
   * - sortOrder: 'asc' or 'desc' (default: 'desc')
   */
  @Get('all-available')
  @HttpCode(HttpStatus.OK)
  async getAllAvailableActivities(
    @Query() filterActivityDto: FilterActivityDto,
  ) {
    return this.service.getAllAvailableActivities(filterActivityDto);
  }

  /**
   * Diagnostic: Find activities by IDs to check their episode links
   * POST /activities/types/find-activities
   */
  @Post('find-activities')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findActivitiesByIds(
    @Body() dto: { activityIds: string[] },
  ) {
    return this.service.findActivitiesByIds(dto.activityIds);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: UpdateActivityTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // ============ ACTIVITIES BY EPISODE - GET OPERATIONS ============

  /**
   * Get all activities for a specific episode
   * GET /activities/types/episode/:episodeId
   */
  @Get('episode/:episodeId')
  // @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllActivitiesByEpisode(
    @Param('episodeId') episodeId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.service.getAllActivitiesByEpisode(
      episodeId,
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }


  /**
   * Get all activities for a specific season by aggregating all season episodes
   * GET /activities/types/season/:seasonId
   */
  @Get('season/:seasonId')
  @HttpCode(HttpStatus.OK)
  async getAllActivitiesBySeason(
    @Param('seasonId') seasonId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.service.getAllActivitiesBySeason(
      seasonId,
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
    );
  }

  /**
   * Get a single activity by ID within an episode
   * GET /activities/types/episode/:episodeId/single/:activityId
   */
  @Get('episode/:episodeId/single/:activityId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getActivityByIdAndEpisode(
    @Param('episodeId') episodeId: string,
    @Param('activityId') activityId: string,
    @Query('type') activityType?: string,
  ) {
    return this.service.getActivityByIdAndEpisode(
      activityId,
      episodeId,
      activityType,
    );
  }

  /**
   * Get multiple activities by IDs within an episode (bulk get)
   * POST /activities/types/episode/:episodeId/bulk-get
   */
  @Post('episode/:episodeId/bulk-get')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getActivitiesByIdsAndEpisode(
    @Param('episodeId') episodeId: string,
    @Body() dto: { activityIds: string[] },
  ) {
    return this.service.getActivitiesByIdsAndEpisode(
      dto.activityIds,
      episodeId,
    );
  }

  // ============ ACTIVITIES BY EPISODE - UPDATE OPERATIONS ============

  /**
   * Update a single activity
   * PATCH /activities/types/episode/:episodeId/single/:activityId
   */
  @Patch('episode/:episodeId/single/:activityId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateActivityByEpisode(
    @Param('episodeId') episodeId: string,
    @Param('activityId') activityId: string,
    @Body() updateData: any,
    @Query('type') activityType?: string,
  ) {
    return this.service.updateActivityByEpisode(
      activityId,
      episodeId,
      updateData,
      activityType,
    );
  }

  /**
   * Bulk update multiple activities
   * PATCH /activities/types/episode/:episodeId/bulk-update
   */
  @Patch('episode/:episodeId/bulk-update')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async bulkUpdateActivitiesByEpisode(
    @Param('episodeId') episodeId: string,
    @Body() dto: { updates: Array<{ id: string; data: any; type?: string }> },
  ) {
    return this.service.bulkUpdateActivitiesByEpisode(episodeId, dto.updates);
  }

  /**
   * Update activities order for an episode
   * PATCH /activities/types/episode/:episodeId/update-order
   */
  @Patch('episode/:episodeId/update-order')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateActivitiesOrder(
    @Param('episodeId') episodeId: string,
    @Body() dto: { updates: Array<{ _id: string; order: number }> },
  ) {
    return this.service.updateActivitiesOrder(episodeId, dto.updates);
  }

  // ============ ACTIVITIES BY EPISODE - DELETE OPERATIONS ============

  /**
   * Delete a single activity
   * DELETE /activities/types/episode/:episodeId/single/:activityId
   */
  @Delete('episode/:episodeId/single/:activityId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteActivityByEpisode(
    @Param('episodeId') episodeId: string,
    @Param('activityId') activityId: string,
    @Query('type') activityType?: string,
  ) {
    return this.service.deleteActivityByEpisode(
      activityId,
      episodeId,
      activityType,
    );
  }

  /**
   * Bulk delete multiple activities
   * DELETE /activities/types/episode/:episodeId/bulk-delete
   */
  @Delete('episode/:episodeId/bulk-delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async bulkDeleteActivitiesByEpisode(
    @Param('episodeId') episodeId: string,
    @Body() dto: { activityIds: string[] },
  ) {
    return this.service.bulkDeleteActivitiesByEpisode(
      episodeId,
      dto.activityIds,
    );
  }

  /**
   * Delete all activities for an episode
   * DELETE /activities/types/episode/:episodeId/all
   */
  @Delete('episode/:episodeId/all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAllActivitiesByEpisode(@Param('episodeId') episodeId: string) {
    return this.service.deleteAllActivitiesByEpisode(episodeId);
  }
}
