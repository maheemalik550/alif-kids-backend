import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { EpisodeSchema } from '../episodes/schemas/episode.schema';
import { UserSchema } from '../auth/schemas/user.schema';
import { SubscriptionEventSchema } from './schemas/subscription-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Episode', schema: EpisodeSchema },
      { name: 'User', schema: UserSchema },
      { name: 'SubscriptionEvent', schema: SubscriptionEventSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
