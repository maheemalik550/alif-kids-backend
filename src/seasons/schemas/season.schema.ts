import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeasonDocument = Season & Document;

@Schema({ timestamps: true })
export class Season {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['active', 'inActive'], default: 'active' })
  status: string;

  @Prop({ required: true })
  seriesId: string;

  @Prop()
  seasonNumber: number;

  @Prop()
  episodes: number;

  @Prop({ required: true })
  icon: string;
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
