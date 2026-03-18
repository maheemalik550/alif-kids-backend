import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ListMatchDocument = ListMatch & Document;

// List item pair sub-schema
@Schema()
export class ListItemPair {
  @Prop({ required: false })
  leftText: string;

  @Prop({ required: false })
  leftImage: string;

  @Prop({ required: false })
  rightText: string;

  @Prop({ required: false })
  rightImage: string;
}

export const ListItemPairSchema = SchemaFactory.createForClass(ListItemPair);

@Schema({ timestamps: true })
export class ListMatch {
  @Prop({ required: true, default: 'List Match' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'list-match' })
  slug: string;

  @Prop({ default: 'ListMatch' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [ListItemPairSchema], default: [] })
  items: ListItemPair[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const ListMatchSchema = SchemaFactory.createForClass(ListMatch);
