import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MultiAnswerShortQADocument = MultiAnswerShortQA & Document;

// Answer option sub-schema
@Schema()
export class AnswerOption {
  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  isCorrect: boolean;
}

export const AnswerOptionSchema = SchemaFactory.createForClass(AnswerOption);

// Question sub-schema
@Schema()
export class MultiAnswerQuestion {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [AnswerOptionSchema], default: [] })
  options: AnswerOption[];

  @Prop({ default: 'pending' })
  status: string;
}

export const MultiAnswerQuestionSchema =
  SchemaFactory.createForClass(MultiAnswerQuestion);

@Schema({ timestamps: true })
export class MultiAnswerShortQA {
  @Prop({ required: true, default: 'Multi Answer Short Q&A' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'multi-answer-short-qa' })
  slug: string;

  @Prop({ default: 'MultiAnswerShortQA' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [MultiAnswerQuestionSchema], default: [] })
  items: MultiAnswerQuestion[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const MultiAnswerShortQASchema =
  SchemaFactory.createForClass(MultiAnswerShortQA);
