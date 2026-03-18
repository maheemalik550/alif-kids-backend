import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class NewsLetter extends Document {
  @Prop({ required: true, unique: true, email: true })
  email: string;
}

export const NewsLetterSchema = SchemaFactory.createForClass(NewsLetter);
