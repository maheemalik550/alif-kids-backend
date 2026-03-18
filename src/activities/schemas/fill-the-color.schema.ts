import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FillTheColorDocument = FillTheColor & Document;

@Schema({ timestamps: true })
export class FillTheColor {
  @Prop({ required: true, default: 'Fill the Color' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'fill-the-color' })
  slug: string;

  @Prop({ default: 'FillTheColor' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop()
  image: string;

  @Prop({ type: [Object], default: [] })
  regions: Array<{
    id: string;
    color?: string;
    label?: string;
  }>;

  @Prop({ type: [String], default: [] })
  colorPalette: string[];

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: [Object], default: [] })
  items: any[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const FillTheColorSchema = SchemaFactory.createForClass(FillTheColor);
