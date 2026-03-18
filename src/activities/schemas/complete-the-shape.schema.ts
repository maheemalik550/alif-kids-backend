import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompleteTheShapeDocument = CompleteTheShape & Document;

// Image sub-schema
@Schema()
export class Image {
  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  direction: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

@Schema({ timestamps: true })
export class CompleteTheShape {
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

  @Prop({ default: 'complete-the-shape' })
  slug: string;

  @Prop({ default: 'CompleteTheShape' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [ImageSchema], default: [] })
  images: Image[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const CompleteTheShapeSchema =
  SchemaFactory.createForClass(CompleteTheShape);
