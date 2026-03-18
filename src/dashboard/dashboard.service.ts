import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Episode, EpisodeDocument } from '../episodes/schemas/episode.schema';
import { User } from '../auth/schemas/user.schema';
import {
  SubscriptionEvent,
  SubscriptionEventDocument,
} from './schemas/subscription-event.schema';
import {
  EpisodeStatsDto,
  SubscriptionStatsDto,
  ContinueEditingDto,
  SubscriptionEventDto,
  DashboardStatsResponseDto,
} from './dto/dashboard-stats.dto';
import { CreateSubscriptionEventDto } from './dto/create-subscription-event.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Episode.name) private episodeModel: Model<EpisodeDocument>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel(SubscriptionEvent.name)
    private subscriptionEventModel: Model<SubscriptionEventDocument>,
  ) {}

  /**
   * Get episode statistics for dashboard
   */
  async getEpisodeStats(): Promise<EpisodeStatsDto> {
    // Get episodes live count (active status)
    const episodesLive = await this.episodeModel.countDocuments({
      status: 'active',
    });

    // Get episodes created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const episodesLiveThisWeek = await this.episodeModel.countDocuments({
      status: 'active',
      createdAt: { $gte: oneWeekAgo },
    });

    // Get scheduled episodes count (you may need to add a 'scheduled' status or check for planned episodes)
    const scheduled = await this.episodeModel.countDocuments({
      status: 'inActive',
      $or: [
        { _id: { $exists: true } }, // Placeholder - adjust based on actual scheduled logic
      ],
    });

    // Get next scheduled date
    const nextScheduled = await this.episodeModel
      .findOne({
        status: 'inActive',
      })
      .sort({ createdAt: 1 })
      .select('createdAt');

    const nextScheduledDate = nextScheduled
      ? this.getNextFriday(nextScheduled.createdAt)
      : 'N/A';

    // Get draft episodes count (you may need to adjust this based on your draft status)
    const drafts = await this.episodeModel.countDocuments({
      $or: [{ status: 'draft' }, { status: 'review' }],
    });

    // Get episodes needing review
    const needsReview = await this.episodeModel.countDocuments({
      status: 'review',
    });

    return {
      episodesLive,
      episodesLiveThisWeek,
      scheduled,
      nextScheduledDate,
      drafts,
      needsReview,
    };
  }

  /**
   * Get subscription statistics for dashboard
   */
  async getSubscriptionStats(): Promise<SubscriptionStatsDto> {
    // Get count of users with active premium subscription
    const activeSubscriptions = await this.userModel.countDocuments({
      premiumSubscription: true,
      isAccountDeleted: false,
    });

    // Get new subscriptions today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const newSubscriptionsToday = await this.subscriptionEventModel.countDocuments({
      eventType: 'subscribed',
      createdAt: { $gte: startOfDay },
    });

    return {
      activeSubscriptions,
      newSubscriptionsToday,
    };
  }

  /**
   * Get episodes available for continue editing
   */
  async getContinueEditing(): Promise<ContinueEditingDto[]> {
    const episodes = await this.episodeModel
      .find({
        $or: [{ status: 'draft' }, { status: 'review' }],
      })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('_id name status updatedAt');

    return episodes.map((episode) => ({
      id: episode._id.toString(),
      name: episode.name,
      status: episode.status === 'review' ? 'Review' : 'Draft',
      updatedAt: episode.updatedAt,
    }));
  }

  /**
   * Get recent subscription events
   */
  async getSubscriptionEvents(): Promise<SubscriptionEventDto[]> {
    const events = await this.subscriptionEventModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    return events.map((event) => ({
      id: event._id.toString(),
      userEmail: event.userEmail || 'N/A',
      packageName: event.packageName || 'N/A',
      eventType: event.eventType,
      status: event.status,
      date: event.createdAt,
    }));
  }

  /**
   * Get complete dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStatsResponseDto> {
    const [episodeStats, subscriptionStats, continueEditing, subscriptionEvents] =
      await Promise.all([
        this.getEpisodeStats(),
        this.getSubscriptionStats(),
        this.getContinueEditing(),
        this.getSubscriptionEvents(),
      ]);

    return {
      episodeStats,
      subscriptionStats,
      continueEditing,
      subscriptionEvents,
    };
  }

  /**
   * Create a subscription event
   */
  async createSubscriptionEvent(
    createSubscriptionEventDto: CreateSubscriptionEventDto,
  ): Promise<SubscriptionEventDocument> {
    const subscriptionEvent = new this.subscriptionEventModel(
      createSubscriptionEventDto,
    );
    return await subscriptionEvent.save();
  }

  /**
   * Get subscription events for a specific user
   */
  async getUserSubscriptionEvents(userId: string): Promise<SubscriptionEventDto[]> {
    const events = await this.subscriptionEventModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });

    return events.map((event) => ({
      id: event._id.toString(),
      userEmail: event.userEmail || 'N/A',
      packageName: event.packageName || 'N/A',
      eventType: event.eventType,
      status: event.status,
      date: event.createdAt,
    }));
  }

  /**
   * Helper function to get the next Friday
   */
  private getNextFriday(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const daysUntilFriday = (5 - day + 7) % 7;
    if (daysUntilFriday === 0) {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + daysUntilFriday);
    }
    return d.toISOString().split('T')[0];
  }
}
