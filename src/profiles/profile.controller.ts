import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * ➕ Create a new profile
   */
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Request() req,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(req.user.id, createProfileDto);
  }

  /**
   * 📋 Get all profiles
   */
  @Get('list')
  async getUserProfiles(@Request() req) {
    return this.profileService.getUserProfiles(req.user.id);
  }

  /**
   * 🔄 Switch to a profile
   */
  @Post('switch/:profileId')
  async switchProfile(
    @Request() req,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.switchProfile(req.user.id, profileId);
  }

  /**
   * ℹ️ Get profile details
   */
  @Get(':profileId')
  async getProfileDetails(
    @Request() req,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.getProfileDetails(req.user.id, profileId);
  }

  /**
   * ✏️ Update profile
   */
  @Put(':profileId')
  async updateProfile(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(
      req.user.id,
      profileId,
      updateProfileDto,
    );
  }

  /**
   * 🗑️ Delete profile
   */
  @Delete(':profileId')
  @HttpCode(HttpStatus.OK)
  async deleteProfile(
    @Request() req,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.deleteProfile(req.user.id, profileId);
  }

  /**
   * 📺 Add to watchlist
   */
  @Post(':profileId/watchlist/add')
  async addToWatchlist(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body('contentId') contentId: string,
  ) {
    return this.profileService.addToWatchlist(
      req.user.id,
      profileId,
      contentId,
    );
  }

  /**
   * ❤️ Add to favorites
   */
  @Post(':profileId/favorites/add')
  async addToFavorites(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body('contentId') contentId: string,
  ) {
    return this.profileService.addToFavorites(
      req.user.id,
      profileId,
      contentId,
    );
  }

  /**
   * 📝 Remove from favorites
   */
  @Post(':profileId/favorites/remove')
  async removeFromFavorites(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body('contentId') contentId: string,
  ) {
    return this.profileService.removeFromFavorites(
      req.user.id,
      profileId,
      contentId,
    );
  }

  /**
   * 📺 Remove from watchlist
   */
  @Post(':profileId/watchlist/remove')
  async removeFromWatchlist(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body('contentId') contentId: string,
  ) {
    return this.profileService.removeFromWatchlist(
      req.user.id,
      profileId,
      contentId,
    );
  }

  /**
   * 👀 Add to viewing history
   */
  @Post(':profileId/history/add')
  async addToViewingHistory(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body('contentId') contentId: string,
  ) {
    return this.profileService.addToViewingHistory(
      req.user.id,
      profileId,
      contentId,
    );
  }

  /**
   * ⏱️ Save continue watching progress
   */
  @Post(':profileId/continue-watching')
  async saveContinueWatching(
    @Request() req,
    @Param('profileId') profileId: string,
    @Body()
    body: {
      contentId: string;
      episodeId: string;
      timeStamp: number;
    },
  ) {
    return this.profileService.saveContinueWatching(
      req.user.id,
      profileId,
      body.contentId,
      body.episodeId,
      body.timeStamp,
    );
  }

  /**
   * 📊 Get profile stats
   */
  @Get(':profileId/stats')
  async getProfileStats(
    @Request() req,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.getProfileStats(req.user.id, profileId);
  }

  // ========== ADMIN ENDPOINTS FOR PROFILE MANAGEMENT ==========

  /**
   * 👤 Admin: Get all profiles for a specific user
   */
  @Get('admin/user/:userId/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async adminGetUserProfiles(@Param('userId') userId: string) {
    return this.profileService.getUserProfiles(userId);
  }

  /**
   * ➕ Admin: Create a profile for a specific user
   */
  @Post('admin/user/:userId/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async adminCreateProfile(
    @Param('userId') userId: string,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profileService.createProfile(userId, createProfileDto);
  }

  /**
   * ℹ️ Admin: Get profile details for a user
   */
  @Get('admin/user/:userId/profile/:profileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async adminGetProfileDetails(
    @Param('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.getProfileDetails(userId, profileId);
  }

  /**
   * ✏️ Admin: Update a profile for a user
   */
  @Put('admin/user/:userId/profile/:profileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async adminUpdateProfile(
    @Param('userId') userId: string,
    @Param('profileId') profileId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(
      userId,
      profileId,
      updateProfileDto,
    );
  }

  /**
   * 🗑️ Admin: Delete a profile for a user
   */
  @Delete('admin/user/:userId/profile/:profileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async adminDeleteProfile(
    @Param('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.deleteProfile(userId, profileId);
  }

  /**
   * 🔄 Admin: Switch user's active profile
   */
  @Post('admin/user/:userId/switch/:profileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async adminSwitchProfile(
    @Param('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.switchProfile(userId, profileId);
  }

  /**
   * 📊 Admin: Get profile stats for a user
   */
  @Get('admin/user/:userId/profile/:profileId/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async adminGetProfileStats(
    @Param('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.profileService.getProfileStats(userId, profileId);
  }
}
