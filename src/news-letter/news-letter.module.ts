import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsLetter, NewsLetterSchema } from './schemas/news-letter.schema';
import { NewsLetterController } from './news-letter.controller';
import { NewsLetterService } from './news-letter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsLetter.name, schema: NewsLetterSchema },
    ]),
  ],
  controllers: [NewsLetterController],
  providers: [NewsLetterService],
})
export class NewsLetterModule {}
