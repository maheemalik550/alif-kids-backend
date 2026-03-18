import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CardMatchDocument = CardMatch & Document;

// Card pair sub-schema
@Schema()
export class CardPair {
  @Prop({ required: true })
  image: string;
}

export const CardPairSchema = SchemaFactory.createForClass(CardPair);

@Schema({ timestamps: true })
export class CardMatch {
  @Prop({ required: true, default: 'Card Match' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'card-match' })
  slug: string;

  @Prop({ default: 'CardMatch' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [CardPairSchema], default: [] })
  pairs: CardPair[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const CardMatchSchema = SchemaFactory.createForClass(CardMatch);
