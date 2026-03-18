import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookDocument = Book & Document;

interface PageData {
  page: string;
  audio: string | null;
  pageStatus: string;
  audioStatus: string;
}

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, unique: true })
  slug: string;

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
  bookUrl: string;

  @Prop()
  series: string;

  @Prop()
  product_url: string;

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

  @Prop({ enum: ['portrait', 'landscape', 'split-view'], default: 'portrait' })
  bookView: string;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: false })
  isTrending: boolean;

  @Prop({ default: false })
  isRecommended: boolean;

  @Prop()
  language: string;

  @Prop({ type: Types.ObjectId, ref: 'BookAge', required: false })
  ageGroupId?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'BookCategory' }], default: [] })
  categoryIds?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'BookType', required: false })
  typeId?: Types.ObjectId;

  @Prop({ type: [Object], default: [] })
  pages: PageData[];

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ type: [String] })
  values: string[];

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Season', required: false })
  seasonId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: false })
  episodeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  dynamicFields: Record<string, any>;
}

export const BookSchema = SchemaFactory.createForClass(Book);
