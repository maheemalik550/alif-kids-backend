import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QAShortAnswerDocument = QAShortAnswer & Document;

// QA item sub-schema
@Schema()
export class QAItem {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], default: [] })
  acceptableAnswers: string[];

  @Prop({ default: 'pending' })
  status: string;
}

export const QAItemSchema = SchemaFactory.createForClass(QAItem);

@Schema({ timestamps: true })
export class QAShortAnswer {
  @Prop({ required: true, default: 'Q&A Short Answer' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'qa-short-answer' })
  slug: string;

  @Prop({ default: 'QAShortAnswer' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [QAItemSchema], default: [] })
  items: QAItem[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const QAShortAnswerSchema = SchemaFactory.createForClass(QAShortAnswer);
