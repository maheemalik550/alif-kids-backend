import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookAgeDocument = BookAge & Document;

@Schema({ timestamps: true })
export class BookAge {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: 0 })
  minAge: number;

  @Prop({ default: 0 })
  maxAge: number;

  @Prop({ default: 0 })
  order: number;

  @Prop({ required: false, default: '' })
  image?: string;
}

export const BookAgeSchema = SchemaFactory.createForClass(BookAge);
