import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AudiosService } from './audios.service';
import { AudiosController } from './audios.controller';
import { Audio, AudioSchema } from './schemas/audio.schema';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Audio.name, schema: AudioSchema }]), SettingsModule],
  controllers: [AudiosController],
  providers: [AudiosService],
  exports: [AudiosService],
})
export class AudiosModule {}
