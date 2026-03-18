// src/database/database.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    if (this.connection.readyState === 1) {
      this.logger.log('✅ MongoDB Connected Successfully');
      // Clean up stale indexes on initialization
      await this.cleanupStaleIndexes();
    } else {
      this.logger.error('❌ MongoDB Connection Failed');
    }
  }

  async cleanupStaleIndexes() {
    try {
      const settingsCollection = this.connection.collection('settings');
      const indexes = await settingsCollection.listIndexes().toArray();

      // Drop stale "key" index if it exists
      for (const index of indexes) {
        if (index.name === 'key_1' || (index.key && index.key.key)) {
          this.logger.log(`Dropping stale index: ${index.name}`);
          await settingsCollection.dropIndex(index.name);
        }
      }
    } catch (error) {
      if (error.message && !error.message.includes('index not found')) {
        this.logger.warn(`Cleanup warning: ${error.message}`);
      }
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}
