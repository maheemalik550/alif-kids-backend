// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { ActivityTypesSeeder } from './seeders/activity-types.seeder';
import {
  ActivityType,
  ActivityTypeSchema,
} from 'src/activities/schemas/activity-type.schema';
import { BooksSeeder } from './seeders/books.seeder';
import { Book, BookSchema } from 'src/books/schemas/book.schema';
import { PackagesSeeder } from './seeders/packages.seeder';
import { Package, PackageSchema } from 'src/packages/schemas/package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityType.name, schema: ActivityTypeSchema },
      { name: Book.name, schema: BookSchema },
      { name: Package.name, schema: PackageSchema },
    ]),
  ],
  providers: [DatabaseService, ActivityTypesSeeder, BooksSeeder, PackagesSeeder],
  exports: [DatabaseService, ActivityTypesSeeder, BooksSeeder, PackagesSeeder],
})
export class DatabaseModule {}

