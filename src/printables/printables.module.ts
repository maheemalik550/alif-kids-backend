import { Module } from '@nestjs/common';
import { PrintablesService } from './printables.service';
import { PrintablesController } from './printables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Printable, PrintableSchema } from './schemas/printable.schema';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Printable.name, schema: PrintableSchema }]),
    SettingsModule,
  ],
  controllers: [PrintablesController],
  providers: [PrintablesService],
})
export class PrintablesModule {}
