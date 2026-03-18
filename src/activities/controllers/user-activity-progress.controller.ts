import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserActivityProgressService } from '../services';
import {
  CreateUserActivityProgressDto,
  UpdateUserActivityProgressDto,
} from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('activities/user-progress')
export class UserActivityProgressController {
  constructor(private readonly service: UserActivityProgressService) {}

  /**
   * Get user progress for all activities by user and episode/surah ID
   * GET /activities/user-progress/activities-by-user/all
   */
  @Get('activities-by-user/all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserProgressForAllActivities(
    @Query('userId') userId: string,
    @Query('episodeId') episodeId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.service.getUserProgressForAllActivities(
      userId,
      episodeId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  /**
   * Bulk create user progress by user and episode ID
   * POST /activities/user-progress/bulk-create-by-episode
   */
  @Post('bulk-create-by-episode')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async bulkCreateByEpisode(
    @Query('userId') userId: string,
    @Query('episodeId') episodeId: string,
  ) {
    return this.service.bulkCreateByEpisode(userId, episodeId);
  }

  /**
   * Update and get user activity progress by ID
   * PUT /activities/user-progress/update-by-id
   */
  @Put('update-by-id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateAndGetProgress(
    @Query('userId') userId: string,
    @Query('activityId') activityId: string,
    @Body() updateData: UpdateUserActivityProgressDto,
  ) {
    return this.service.updateAndGetProgress(userId, activityId, updateData);
  }

  /**
   * Drop user activity progress collection (admin only)
   * DELETE /activities/user-progress/drop-collection
   */
  @Delete('drop-collection')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async dropCollection() {
    return this.service.dropCollection();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserActivityProgressDto) {
    // Convert all IDs to MongoDB ObjectId
    const convertedDto = {
      ...dto,
      userId: Types.ObjectId.isValid(dto.userId)
        ? new Types.ObjectId(dto.userId)
        : dto.userId,
      activityId: Types.ObjectId.isValid(dto.activityId)
        ? new Types.ObjectId(dto.activityId)
        : dto.activityId,
      episodeId: Types.ObjectId.isValid(dto.episodeId)
        ? new Types.ObjectId(dto.episodeId)
        : dto.episodeId,
    };
    const query = {
      $and: [
        {
          $or: [
            { userId: convertedDto.userId.toString() },
            { userId: convertedDto.userId },
          ],
        },
        {
          $or: [
            { activityId: convertedDto.activityId.toString() },
            { activityId: convertedDto.activityId },
          ],
        },
      ],
    };

    const existingProgress = await this.service.findByUserAndActivity(
      convertedDto.userId.toString(),
      convertedDto.activityId.toString(),
    );
    if (existingProgress) {
      // Update existing progress record
      return this.service.update(
        existingProgress._id.toString(),
        convertedDto as any,
      );
    }

    // Create new progress record
    return this.service.create(convertedDto as any);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  findUserProgress(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.service.findUserProgress(
      userId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('user/:userId/episode/:episodeId')
  @UseGuards(JwtAuthGuard)
  getEpisodeProgress(
    @Param('userId') userId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.service.getEpisodeProgress(episodeId, userId);
  }

  /**
   * Delete user progress by user and episode ID
   * DELETE /activities/user-progress/delete-progress
   */
  @Delete('delete-progress')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteUserProgress(
    @Query('userId') userId: string,
    @Query('episodeId') episodeId: string,
  ) {
    return this.service.deleteUserProgress(userId, episodeId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.service.findByUserAndActivity(id, '');
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateUserActivityProgressDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  /**
   * Get related activities in the same episode for a user
   * GET /activities/user-progress/:activityId/related?userId=...&limit=...
   */
  @Get(':activityId/related')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getRelatedActivitiesForUser(
    @Param('activityId') activityId: string,
    @Query('userId') userId: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.service.getRelatedActivitiesForUser(
      userId,
      activityId,
      parseInt(limit, 10),
    );
  }

  /**
   * Get similar activities by type that user hasn't started yet
   * GET /activities/user-progress/:activityId/similar?userId=...&limit=...
   */
  @Get(':activityId/similar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSimilarActivitiesForUser(
    @Param('activityId') activityId: string,
    @Query('userId') userId: string,
    @Query('limit') limit: string = '10',
  ) {
    return this.service.getSimilarActivitiesForUser(
      userId,
      activityId,
      parseInt(limit, 10),
    );
  }
}
