import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MultiChoiceQuestionDocument = MultiChoiceQuestion & Document;

// Option sub-schema
@Schema()
export class Option {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isCorrect: boolean;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

// Question item sub-schema
@Schema()
export class QuestionItem {
  @Prop({ required: true })
  question: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: [OptionSchema], default: [] })
  options: Option[];
}

export const QuestionItemSchema = SchemaFactory.createForClass(QuestionItem);

@Schema({ timestamps: true })
export class MultiChoiceQuestion {
  @Prop({ required: true })
  title: string;

  @Prop({ default: 0 })
  currentPageIndex: number;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ default: 'MCQs' })
  routeKey: string;

  @Prop({ default: 'multi-choice-questions' })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [QuestionItemSchema], default: [] })
  items: QuestionItem[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const MultiChoiceQuestionSchema =
  SchemaFactory.createForClass(MultiChoiceQuestion);
