import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PopularBookDocument = PopularBook & Document;

@Schema({ timestamps: true })
export class PopularBook {
  @Prop({ required: true, trim: true, unique: true })
  title: string;


  @Prop({ required: false, default: '' })
  coverImage?: string;
}

export const PopularBookSchema = SchemaFactory.createForClass(PopularBook);
