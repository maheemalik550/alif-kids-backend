import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookMetaController } from './book-meta.controller';
import { BookMetaService } from './book-meta.service';
import { BookAge, BookAgeSchema } from './schemas/book-age.schema';
import { BookCategory, BookCategorySchema } from './schemas/book-category.schema';
import { BookType, BookTypeSchema } from './schemas/book-type.schema';
import { PopularBook, PopularBookSchema } from './schemas/popular-book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookAge.name, schema: BookAgeSchema },
      { name: BookCategory.name, schema: BookCategorySchema },
      { name: BookType.name, schema: BookTypeSchema },
      { name: PopularBook.name, schema: PopularBookSchema },

    ]),
  ],
  controllers: [BookMetaController],
  providers: [BookMetaService],
  exports: [BookMetaService],
})
export class BookMetaModule {}
