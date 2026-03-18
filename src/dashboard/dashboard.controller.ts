import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  EpisodeStatsDto,
  SubscriptionStatsDto,
  DashboardStatsResponseDto,
  SubscriptionEventDto,
} from './dto/dashboard-stats.dto';
import { CreateSubscriptionEventDto } from './dto/create-subscription-event.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET /dashboard/stats
   * Get complete dashboard statistics
   */
  @Get('stats')
  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    return await this.dashboardService.getDashboardStats();
  }

  /**
   * GET /dashboard/episodes
   * Get episode statistics only
   */
  @Get('episodes')
  async getEpisodeStats(): Promise<EpisodeStatsDto> {
    return await this.dashboardService.getEpisodeStats();
  }

  /**
   * GET /dashboard/subscriptions
   * Get subscription statistics only
   */
  @Get('subscriptions')
  async getSubscriptionStats(): Promise<SubscriptionStatsDto> {
    return await this.dashboardService.getSubscriptionStats();
  }

  /**
   * GET /dashboard/continue-editing
   * Get episodes available for continue editing
   */
  @Get('continue-editing')
  async getContinueEditing() {
    return await this.dashboardService.getContinueEditing();
  }

  /**
   * GET /dashboard/subscription-events
   * Get recent subscription events
   */
  @Get('subscription-events')
  async getSubscriptionEvents(): Promise<SubscriptionEventDto[]> {
    return await this.dashboardService.getSubscriptionEvents();
  }

  /**
   * POST /dashboard/subscription-events
   * Create a new subscription event
   */
  @Post('subscription-events')
  async createSubscriptionEvent(
    @Body() createSubscriptionEventDto: CreateSubscriptionEventDto,
  ) {
    return await this.dashboardService.createSubscriptionEvent(
      createSubscriptionEventDto,
    );
  }

  /**
   * GET /dashboard/subscription-events/user/:userId
   * Get subscription events for a specific user
   */
  @Get('subscription-events/user/:userId')
  async getUserSubscriptionEvents(
    @Param('userId') userId: string,
  ): Promise<SubscriptionEventDto[]> {
    return await this.dashboardService.getUserSubscriptionEvents(userId);
  }
}
