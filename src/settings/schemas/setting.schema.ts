import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FieldType, ModuleEnum } from '../enums';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true, unique: true, sparse: true, index: true })
  fieldKey: string;

  @Prop({ required: true, enum: Object.values(FieldType) })
  fieldType: FieldType;

  @Prop({
    required: true,
    type: [String],
    enum: Object.values(ModuleEnum),
    index: true,
  })
  modules: string[];

  @Prop({ required: true, default: false })
  isRequired: boolean;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop()
  placeholder: string;

  @Prop({ type: Object })
  defaultValue: any;

  @Prop({ type: Object })
  validationRules: Record<string, any>;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

// Create compound index on modules for efficient queries
SettingSchema.index({ modules: 1, isActive: 1 });
SettingSchema.index({ fieldKey: 1 });
