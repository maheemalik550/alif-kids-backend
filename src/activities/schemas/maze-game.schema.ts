import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MazeGameDocument = MazeGame & Document;

// Coordinate sub-schema
@Schema()
export class Coordinate {
  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  col: number;
}

export const CoordinateSchema = SchemaFactory.createForClass(Coordinate);

@Schema({ timestamps: true })
export class MazeGame {
  @Prop({ required: true, default: 'Maze Game' })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  saveAsDraft: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 'maze-game' })
  slug: string;

  @Prop({ default: 'MazeGame' })
  routeKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ default: 0 })
  weightage: number;

  @Prop({ default: false })
  isWeightage: boolean;

  @Prop({ type: Types.ObjectId, ref: 'ActivityType', required: true })
  typeId: Types.ObjectId;

  @Prop()
  type: string;

  @Prop({ type: CoordinateSchema })
  start: Coordinate;

  @Prop({ type: CoordinateSchema })
  end: Coordinate;

  @Prop({ type: [[Number]], default: [] })
  matrix: number[][];

  @Prop()
  characterImg: string;

  @Prop()
  endImg: string;

  @Prop()
  wallImage: string;

  @Prop()
  pathImg: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const MazeGameSchema = SchemaFactory.createForClass(MazeGame);
