import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReflectRespondDocument = ReflectRespond & Document;

// Reflection item sub-schema
@Schema()
export class ReflectionItem {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], default: [] })
  answers: string[];
}

export const ReflectionItemSchema =
  SchemaFactory.createForClass(ReflectionItem);

@Schema({ timestamps: true })
export class ReflectRespond {
  @Prop({ required: true, default: 'Reflect & Respond' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'reflect-respond' })
  slug: string;

  @Prop({ default: 'ReflectRespond' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [ReflectionItemSchema], default: [] })
  items: ReflectionItem[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const ReflectRespondSchema =
  SchemaFactory.createForClass(ReflectRespond);
