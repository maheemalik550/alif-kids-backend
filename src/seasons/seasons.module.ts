import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Season, SeasonSchema } from './schemas/season.schema';
import { Episode, EpisodeSchema } from '../episodes/schemas/episode.schema';
import { Series, SeriesSchema } from '../series/schemas/series.schema';
import { Book, BookSchema } from '../books/schemas/book.schema';
import { Video, VideoSchema } from '../videos/schemas/video.schema';
import { Audio, AudioSchema } from '../audios/schemas/audio.schema';
import { Game, GameSchema } from '../games/schemas/game.schema';
import { Printable, PrintableSchema } from '../printables/schemas/printable.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Season.name, schema: SeasonSchema },
      { name: Episode.name, schema: EpisodeSchema },
      { name: Series.name, schema: SeriesSchema },
      { name: Book.name, schema: BookSchema },
      { name: Video.name, schema: VideoSchema },
      { name: Audio.name, schema: AudioSchema },
      { name: Game.name, schema: GameSchema },
      { name: Printable.name, schema: PrintableSchema },
    ]),
  ],
  controllers: [SeasonsController],
  providers: [SeasonsService],
})
export class SeasonsModule {}
