import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionEventDocument = SubscriptionEvent & Document;

@Schema({ timestamps: true })
export class SubscriptionEvent {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: false })
  userEmail: string;

  @Prop({ type: Types.ObjectId, ref: 'Package', required: false })
  packageId: Types.ObjectId;

  @Prop({ required: false })
  packageName: string;

  @Prop({
    enum: ['subscribed', 'renewed', 'cancelled', 'expired', 'upgraded', 'downgraded'],
    default: 'subscribed',
  })
  eventType: string;

  @Prop({ enum: ['pending', 'active', 'completed', 'failed'], default: 'active' })
  status: string;

  @Prop({ type: Date, required: false })
  subscribedAt: Date;

  @Prop({ type: Date, required: false })
  expiresAt: Date;

  @Prop({ required: false })
  notes: string;

  @Prop({ type: Date, default: () => new Date() })
  createdAt?: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt?: Date;
}

export const SubscriptionEventSchema = SchemaFactory.createForClass(
  SubscriptionEvent,
);
