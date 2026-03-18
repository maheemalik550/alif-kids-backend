import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: false, unique: false })
  username: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false, type: [String] })
  inAppUserId: string[];

  @Prop({ required: true, default: false })
  premiumSubscription: boolean;

  @Prop({ required: false, default: false })
  isAccountDeleted: boolean;

  @Prop({ required: false, unique: false })
  email: string;

  @Prop({ required: false, unique: true, sparse: true })
  refreshToken: string;

  @Prop({ required: false, default: false })
  isRegistered: boolean;

  @Prop({ required: false })
  purchaseInfo: string;

  @Prop({ required: false, default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ required: false, default: 'user', enum: ['user', 'school', 'student', 'admin'] })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'School', default: null })
  schoolId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', default: null })
  studentId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Profile', default: [] })
  profiles: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Profile', default: null })
  currentActiveProfile: Types.ObjectId;

  @Prop({ default: 5 })
  maxProfiles: number;

  @Prop({ type: Types.ObjectId, ref: 'Voucher', default: null })
  usedVoucher: Types.ObjectId;

  @Prop({ required: false })
  voucherCode: string;

  @Prop({ type: Date, default: null })
  voucherAppliedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
