import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Series, SeriesSchema } from './schemas/series.schema';
import { Season, SeasonSchema } from '../seasons/schemas/season.schema';
import { Episode, EpisodeSchema } from '../episodes/schemas/episode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Series.name, schema: SeriesSchema },
      { name: Season.name, schema: SeasonSchema },
      { name: Episode.name, schema: EpisodeSchema },
    ]),
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
