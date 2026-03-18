import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Episode, EpisodeSchema } from './schemas/episode.schema';
import { Series, SeriesSchema } from '../series/schemas/series.schema';
import { Season, SeasonSchema } from '../seasons/schemas/season.schema';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Episode.name, schema: EpisodeSchema },
      { name: Series.name, schema: SeriesSchema },
      { name: Season.name, schema: SeasonSchema },
    ]),
    SettingsModule,
  ],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}
