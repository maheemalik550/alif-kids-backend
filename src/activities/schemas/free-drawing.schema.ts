import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FreeDrawingDocument = FreeDrawing & Document;

@Schema({ timestamps: true })
export class FreeDrawing {
  @Prop({ required: true })
  title: string;

  @Prop()
  question: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Surah' })
  surahId: Types.ObjectId;

  @Prop({ default: 'free-drawing' })
  slug: string;

  @Prop({ default: 'FreeDrawing' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode' })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const FreeDrawingSchema = SchemaFactory.createForClass(FreeDrawing);
