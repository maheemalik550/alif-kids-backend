import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategorizeItDocument = CategorizeIt & Document;

// Category item sub-schema
@Schema()
export class CategoryItem {
  @Prop()
  image: string;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  columnIndex: number;

  @Prop()
  item: string;
}

export const CategoryItemSchema = SchemaFactory.createForClass(CategoryItem);

@Schema({ timestamps: true })
export class CategorizeIt {
  @Prop({ required: true, default: 'Categorize It' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'categorize-it' })
  slug: string;

  @Prop({ default: 'CategorizeIt' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: [CategoryItemSchema], default: [] })
  items: CategoryItem[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const CategorizeItSchema = SchemaFactory.createForClass(CategorizeIt);
