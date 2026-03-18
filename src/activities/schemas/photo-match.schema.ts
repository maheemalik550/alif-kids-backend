import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PhotoMatchDocument = PhotoMatch & Document;

// Photo item sub-schema
@Schema()
export class PhotoItem {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  isCorrect: boolean;
}

export const PhotoItemSchema = SchemaFactory.createForClass(PhotoItem);

// Photo pair sub-schema
@Schema()
export class PhotoPair {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [PhotoItemSchema], required: true })
  items: PhotoItem[];
}

export const PhotoPairSchema = SchemaFactory.createForClass(PhotoPair);

@Schema({ timestamps: true })
export class PhotoMatch {
  @Prop({ required: true, default: 'Photo Match' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'photo-match' })
  slug: string;

  @Prop({ default: 'PhotoMatch' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [PhotoPairSchema], default: [] })
  pairs: PhotoPair[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const PhotoMatchSchema = SchemaFactory.createForClass(PhotoMatch);
