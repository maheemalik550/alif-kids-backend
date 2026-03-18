export class EpisodeStatsDto {
  episodesLive: number;
  episodesLiveThisWeek: number;
  scheduled: number;
  nextScheduledDate: string;
  drafts: number;
  needsReview: number;
}

export class SubscriptionStatsDto {
  activeSubscriptions: number;
  newSubscriptionsToday: number;
}

export class ContinueEditingDto {
  id: string;
  name: string;
  status: string;
  updatedAt: Date;
}

export class SubscriptionEventDto {
  id: string;
  userEmail: string;
  packageName: string;
  eventType: string;
  status: string;
  date: Date;
}

export class DashboardStatsResponseDto {
  episodeStats: EpisodeStatsDto;
  subscriptionStats: SubscriptionStatsDto;
  continueEditing: ContinueEditingDto[];
  subscriptionEvents: SubscriptionEventDto[];
}
