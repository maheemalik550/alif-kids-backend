import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HandsOnActivityDocument = HandsOnActivity & Document;

// Step sub-schema
@Schema()
export class ActivityStep {
  @Prop({ required: true })
  stepNumber: number;

  @Prop({ required: true })
  instruction: string;

  @Prop()
  imageUrl: string;
}

export const ActivityStepSchema = SchemaFactory.createForClass(ActivityStep);

@Schema({ timestamps: true })
export class HandsOnActivity {
  @Prop({ required: true, default: 'Hands-On Activity' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'hands-on-activity' })
  slug: string;

  @Prop({ default: 'HandsOnActivity' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [ActivityStepSchema], default: [] })
  steps: ActivityStep[];

  @Prop()
  materials: string[];

  @Prop()
  objectives: string[];

  @Prop({ default: false })
  isMediaFlag: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const HandsOnActivitySchema =
  SchemaFactory.createForClass(HandsOnActivity);
