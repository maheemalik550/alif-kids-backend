import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop()
  tagline: string;

  @Prop()
  isbn: string;

  @Prop({ type: [Number], required: true })
  age: [number, number];

  @Prop()
  price_gbp: number;

  @Prop()
  slug: string;

  @Prop()
  series: string;

  @Prop()
  videoUrl: string;

  @Prop()
  overview: string;

  @Prop()
  learning_notes: string;

  @Prop()
  islamic_references: string;

  @Prop()
  for_parents_teachers: string;

  @Prop()
  cover_image: string;

  @Prop()
  duration: number;

  @Prop()
  thumbnail: string;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ type: [String] })
  values: string[];

  @Prop({ type: Types.ObjectId, ref: 'Season', required: false })
  seasonId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: false })
  episodeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  dynamicFields: Record<string, any>;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
