import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DynamicOrderBlanksDocument = DynamicOrderBlanks & Document;

// Blank item sub-schema
@Schema()
export class BlankItem {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  correctPosition: number;
}

export const BlankItemSchema = SchemaFactory.createForClass(BlankItem);

@Schema({ timestamps: true })
export class DynamicOrderBlanks {
  @Prop({ required: true, default: 'Dynamic Order Blanks' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'dynamic-order-blanks' })
  slug: string;

  @Prop({ default: 'DynamicOrderBlanks' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ required: true })
  fullText: string;

  @Prop({ type: [BlankItemSchema], default: [] })
  blanks: BlankItem[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const DynamicOrderBlanksSchema =
  SchemaFactory.createForClass(DynamicOrderBlanks);
