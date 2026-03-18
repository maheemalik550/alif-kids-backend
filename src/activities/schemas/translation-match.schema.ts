import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TranslationMatchDocument = TranslationMatch & Document;

// Translation pair sub-schema
@Schema()
export class TranslationPair {
  @Prop({ required: true })
  original: string;

  @Prop({ required: true })
  translation: string;
}

export const TranslationPairSchema =
  SchemaFactory.createForClass(TranslationPair);

@Schema({ timestamps: true })
export class TranslationMatch {
  @Prop({ required: true, default: 'Translation Match' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'translation-match' })
  slug: string;

  @Prop({ default: 'TranslationMatch' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [TranslationPairSchema], default: [] })
  pairs: TranslationPair[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const TranslationMatchSchema =
  SchemaFactory.createForClass(TranslationMatch);
