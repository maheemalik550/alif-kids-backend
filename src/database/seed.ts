import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ActivityTypesSeeder } from './seeders/activity-types.seeder';
import { BooksSeeder } from './seeders/books.seeder';
import { PackagesSeeder } from './seeders/packages.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const activityTypesSeeder = app.get(ActivityTypesSeeder);
  const booksSeeder = app.get(BooksSeeder);
  const packagesSeeder = app.get(PackagesSeeder);

  try {
    await activityTypesSeeder.seed();
    await booksSeeder.seed();
    await packagesSeeder.seed();
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
