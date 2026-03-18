import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { SettingsModule } from '../settings/settings.module';
import { BookMetaModule } from '../book-meta/book-meta.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    SettingsModule,
    BookMetaModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
