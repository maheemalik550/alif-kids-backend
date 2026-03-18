import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeriesDocument = Series & Document;

@Schema({ timestamps: true })
export class Series {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['active', 'inActive'], default: 'active' })
  status: string;

  @Prop({ required: true })
  owner: string;

  @Prop()
  seasons: number;

  @Prop()
  episodes: number;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  icon: string;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
