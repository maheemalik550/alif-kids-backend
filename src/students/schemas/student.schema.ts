import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ trim: true })
  rollNumber?: string;

  @Prop({ trim: true })
  grade?: string;

  @Prop({ trim: true })
  email?: string;

  @Prop({ enum: ['active', 'inActive'], default: 'active' })
  status: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
