import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AudioDocument = Audio & Document;

@Schema({ timestamps: true })
export class Audio {
  @Prop({ required: true })
  title: string;

  @Prop()
  tagline: string;

  @Prop()
  slug: string;

  @Prop()
  series: string;

  @Prop()
  audioUrl: string;

  @Prop()
  cover_image: string;

  @Prop()
  thumbnail: string;

  @Prop({ default: 0 })
  duration: number;

  @Prop({ type: [Number], default: [] })
  age: [number, number];

  @Prop({ default: 0 })
  price_gbp: number;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ type: [String], default: [] })
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

export const AudioSchema = SchemaFactory.createForClass(Audio);
