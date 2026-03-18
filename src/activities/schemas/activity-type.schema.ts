import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityTypeDocument = ActivityType & Document;

@Schema({ timestamps: true })
export class ActivityType {
  @Prop({ required: true, default: 'Card Match Game', trim: true })
  name: string;

  @Prop({ trim: true, unique: true })
  slug: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  img: string;

  @Prop({ required: true, trim: true })
  color: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const ActivityTypeSchema = SchemaFactory.createForClass(ActivityType);
