import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EpisodeDocument = Episode & Document;

@Schema({ timestamps: true })
export class Episode {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: ['active', 'inActive'], default: 'active' })
  status: string;

  @Prop({ required: true, ref: 'Season' })
  seasonId: string;

  @Prop({ required: true, ref: 'Series' })
  seriesId: string;

  @Prop({ type: [Number], required: true })
  age: [number, number];

  @Prop({ type: [String] })
  values: string[];

  @Prop()
  episodeNumber: number;

  @Prop()
  duration: number;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop()
  overview: string;

  @Prop()
  talkingPoints: string;

  @Prop()
  notes: string;

  @Prop()
  forParentsAndTeachers: string;

  @Prop({ type: Object, default: {} })
  dynamicFields: Record<string, any>;

  @Prop({ type: Date, default: () => new Date() })
  createdAt?: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt?: Date;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
