import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WordDiscoveryDocument = WordDiscovery & Document;

// Matrix cell sub-schema
@Schema()
export class MatrixCell {
  @Prop({ type: String, required: true })
  ch: string;

  @Prop({ type: Boolean, required: true })
  fixed: boolean;
}

export const MatrixCellSchema = SchemaFactory.createForClass(MatrixCell);

// Path coordinate sub-schema
@Schema()
export class PathCoordinate {
  @Prop({ type: Number, required: true })
  row: number;

  @Prop({ type: Number, required: true })
  col: number;
}

export const PathCoordinateSchema = SchemaFactory.createForClass(PathCoordinate);

// Word sub-schema
@Schema()
export class Word {
  @Prop({ type: String, required: true })
  word: string;

  @Prop({ type: String, required: true })
  direction: string;

  @Prop({ type: [PathCoordinateSchema], required: true })
  path: PathCoordinate[];

  @Prop({ type: [String], required: true })
  coordinates: string[];
}

export const WordSchema = SchemaFactory.createForClass(Word);

@Schema({ timestamps: true })
export class WordDiscovery {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Surah' })
  surahId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ default: 'word-discovery' })
  slug: string;

  @Prop()
  gridSize: string;

  @Prop({ type: [[MatrixCellSchema]], default: [] })
  matrix: MatrixCell[][];

  @Prop({ type: [WordSchema], default: [] })
  words: Word[];

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: 'ObjectId', ref: 'User' })
  createdBy: Types.ObjectId;
}

export const WordDiscoverySchema = SchemaFactory.createForClass(WordDiscovery);
