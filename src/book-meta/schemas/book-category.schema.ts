import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookCategoryDocument = BookCategory & Document;

@Schema({ timestamps: true })
export class BookCategory {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ required: false, default: '' })
  image?: string;
}

export const BookCategorySchema = SchemaFactory.createForClass(BookCategory);
