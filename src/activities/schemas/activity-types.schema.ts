import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityTypesDocument = ActivityTypes & Document;

@Schema({ timestamps: true })
export class ActivityTypes {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: '' })
  slug: string;

  @Prop({ default: '' })
  routeKey: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop()
  icon: string;

  @Prop()
  color: string;
}

export const ActivityTypesSchema = SchemaFactory.createForClass(ActivityTypes);
