import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  tagline: string;

  @Prop({ type: [Number], required: true })
  age: [number, number];

  @Prop()
  price_gbp: number;

  @Prop()
  genre: string;

  @Prop()
  series: string;

  @Prop()
  game_url: string;

  @Prop()
  overview: string;

  @Prop()
  learning_notes: string;

  @Prop()
  islamic_references: string;

  @Prop()
  for_parents_teachers: string;

  @Prop()
  featuredImage: string;

  @Prop()
  cover_image: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ type: [String] })
  values: string[];

  @Prop({ type: [String] })
  peakinside: string[];

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: false })
  episodeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Season', required: false })
  seasonId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  dynamicFields: Record<string, any>;
}

export const GameSchema = SchemaFactory.createForClass(Game);
