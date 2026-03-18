import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FillInTheBlanksDocument = FillInTheBlanks & Document;

// Hidden word sub-schema
@Schema()
export class HiddenWord {
  @Prop({ required: true })
  originalWord: string;

  @Prop({ required: true })
  position: number;
}

export const HiddenWordSchema = SchemaFactory.createForClass(HiddenWord);

@Schema({ timestamps: true })
export class FillInTheBlanks {
  @Prop({ required: true, default: 'Fill In The Blanks' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'fill-in-the-blanks' })
  slug: string;

  @Prop({ default: 'FillInTheBlanks' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ default: '' })
  paragraphText: string;

  @Prop({ type: [HiddenWordSchema], default: [] })
  hiddenWords: HiddenWord[];

  @Prop({ default: '' })
  displayText: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const FillInTheBlanksSchema =
  SchemaFactory.createForClass(FillInTheBlanks);
