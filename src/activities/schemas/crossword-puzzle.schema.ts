import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CrosswordPuzzleDocument = CrosswordPuzzle & Document;

// Crossword cell sub-schema
@Schema()
export class CrosswordCell {
  @Prop({ required: true })
  isPattern: boolean;

  @Prop()
  alphabet: string;

  @Prop({ type: [Number], default: [] })
  referenceNo: number[];

  @Prop({ type: [Number], default: [] })
  wordReference: number[];

  @Prop()
  referenceHeading: string;

  @Prop()
  referenceDesc: string;
}

export const CrosswordCellSchema = SchemaFactory.createForClass(CrosswordCell);

// Reference sub-schema
@Schema()
export class Reference {
  @Prop({ required: true })
  word: string;

  @Prop()
  referenceHeading: string;

  @Prop()
  referenceDesc: string;

  @Prop({ type: [Number], default: [] })
  clueNumbers: number[];

  @Prop()
  clueNumber: number;
}

export const ReferenceSchema = SchemaFactory.createForClass(Reference);

@Schema({ timestamps: true })
export class CrosswordPuzzle {
  @Prop({ required: true, default: 'Crossword Puzzle' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'crossword-puzzle' })
  slug: string;

  @Prop({ default: 'CrosswordPuzzle' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop({ type: [[CrosswordCellSchema]], default: [] })
  crosswordPuzzleMatrix: CrosswordCell[][];

  @Prop({ type: [ReferenceSchema], default: [] })
  references: Reference[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const CrosswordPuzzleSchema =
  SchemaFactory.createForClass(CrosswordPuzzle);
