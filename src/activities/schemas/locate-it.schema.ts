import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocateItDocument = LocateIt & Document;

// Stepper data sub-schema
@Schema()
export class StepperData {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  col: number;

  @Prop()
  label: string;

  @Prop()
  dropImg: string;

  @Prop()
  ansImg: string;

  @Prop({ required: true })
  isMain: boolean;
}

export const StepperDataSchema = SchemaFactory.createForClass(StepperData);

// Stepper sub-schema
@Schema()
export class Stepper {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  img: string;

  @Prop({ type: [StepperDataSchema], required: true })
  data: StepperData[];
}

export const StepperSchema = SchemaFactory.createForClass(Stepper);

@Schema({ timestamps: true })
export class LocateIt {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'locate-it' })
  slug: string;

  @Prop({ default: 'LocateIt' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [StepperSchema], default: [] })
  stepper: Stepper[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const LocateItSchema = SchemaFactory.createForClass(LocateIt);
