import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Voucher extends Document {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ required: true, default: 1 })
  maxUses: number;

  @Prop({ required: true, default: 0 })
  currentUses: number;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  usedBy: Types.ObjectId[];

  @Prop({ required: true, default: 'premium' })
  subscriptionType: string;

  @Prop({ required: false })
  notes: string;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: Date;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
