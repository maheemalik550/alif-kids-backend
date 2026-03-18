import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  code?: string;

  @Prop({ trim: true })
  contactPerson?: string;

  @Prop({ trim: true })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ enum: ['active', 'inActive'], default: 'active' })
  status: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
