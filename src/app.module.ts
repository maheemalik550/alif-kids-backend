import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { NewsLetterModule } from './news-letter/news-letter.module';
import { MobileAuthModule } from './mobile-auth/mobile-auth.module';
import { SeriesModule } from './series/series.module';
import { SeasonsModule } from './seasons/seasons.module';
import { EpisodesModule } from './episodes/episodes.module';
import { ActivitiesModule } from './activities/activities.module';
import { VersionModule } from './version/version.module';
import { FileUploadModule } from './common/file-upload/file-upload.module';
import { BooksModule } from './books/books.module';
import { VideosModule } from './videos/videos.module';
import { AudiosModule } from './audios/audios.module';
import { PrintablesModule } from './printables/printables.module';
import { GamesModule } from './games/games.module';
import { SettingsModule } from './settings/settings.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { PackagesModule } from './packages/packages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SchoolsModule } from './schools/schools.module';
import { StudentsModule } from './students/students.module';
import { SchoolUsersModule } from './school-users/school-users.module';
import { BookMetaModule } from './book-meta/book-meta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ makes env variables available everywhere
      envFilePath: '.env', // optional (default is .env)
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100000,
      },
    ]),
    AuthModule,
    ProfilesModule,
    MobileAuthModule,
    MyLoggerModule,
    NewsLetterModule,
    SeriesModule,
    SeasonsModule,
    EpisodesModule,
    ActivitiesModule,
    VersionModule,
    BooksModule,
    VideosModule,
    AudiosModule,
    PrintablesModule,
    GamesModule,
    SettingsModule,
    VouchersModule,
    PackagesModule,
    DashboardModule,
    SchoolsModule,
    StudentsModule,
    SchoolUsersModule,
    BookMetaModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
