import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookTypeDocument = BookType & Document;

@Schema({ timestamps: true })
export class BookType {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({ required: false, trim: true })
  description: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ required: false, default: '' })
  image?: string;
}

export const BookTypeSchema = SchemaFactory.createForClass(BookType);
