import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Version extends Document {
  @Prop()
  name: string;

  @Prop()
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  adminId: Types.ObjectId;

  @Prop()
  iosBuildVersion: string;

  @Prop()
  androidBuildVersion: string;

  @Prop()
  iosVersionNumber: number;

  @Prop()
  androidVersionNumber: number;

  @Prop({ default: true })
  forceInstall: boolean;

  @Prop({ default: false })
  isVisible: boolean;

  @Prop({ default: true })
  isDeleted: boolean;

  @Prop({ required: true, enum: ['ios', 'android', 'both'] })
  platform: string;
}

export const VersionSchema = SchemaFactory.createForClass(Version);
