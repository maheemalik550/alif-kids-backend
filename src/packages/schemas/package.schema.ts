import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackageDocument = Package & Document;

@Schema({ timestamps: true })
export class Package {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: false })
  tagline?: string;

  @Prop({ required: true, type: [String], default: [] })
  features: string[];

  @Prop({ required: true })
  ctaLabel: string;

  @Prop({ required: true })
  alreadySubscribed: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Date, default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt: Date;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
