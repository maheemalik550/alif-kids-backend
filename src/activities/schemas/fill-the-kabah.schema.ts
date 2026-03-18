import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FillTheKabahDocument = FillTheKabah & Document;

// Kabah coordinate sub-schema
@Schema()
export class KabahPart {
  @Prop({ required: true })
  partName: string;

  @Prop()
  color: string;

  @Prop()
  pattern: string;
}

export const KabahPartSchema = SchemaFactory.createForClass(KabahPart);

@Schema({ timestamps: true })
export class FillTheKabah {
  @Prop({ required: true, default: 'Fill The Kabah' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'fill-the-kabah' })
  slug: string;

  @Prop({ default: 'FillTheKabah' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [KabahPartSchema], default: [] })
  kabahParts: KabahPart[];

  @Prop()
  templateImageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const FillTheKabahSchema = SchemaFactory.createForClass(FillTheKabah);
