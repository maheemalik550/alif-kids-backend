import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserActivityProgressDocument = UserActivityProgress & Document;

// Progress history sub-schema
@Schema({ _id: false })
export class ActivityProgressHistory {
  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ default: 0 })
  timer: number;

  @Prop({ default: 0 })
  wrongAttempts: number;

  @Prop({ default: 0 })
  correctAttempts: number;

  @Prop({ default: 0 })
  questionsCount: number;

  @Prop({ enum: ['pending', 'completed'], default: 'pending' })
  status: string;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ActivityProgressHistorySchema = SchemaFactory.createForClass(
  ActivityProgressHistory,
);

@Schema({ timestamps: true })
export class UserActivityProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  activityId: Types.ObjectId;

  @Prop({ required: true })
  activityModel: string; // Dynamic model reference (e.g., "MultiChoiceQuestion", "FillInTheBlanks")

  @Prop({ type: Types.ObjectId, ref: 'Episode', required: true })
  episodeId: Types.ObjectId;

  @Prop({ enum: ['pending', 'completed'], default: 'pending' })
  status: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ default: 0 })
  timer: number;

  @Prop({ default: 0 })
  wrongAttempts: number;

  @Prop({ default: 0 })
  correctAttempts: number;

  @Prop({ default: 0 })
  questionsCount: number;

  @Prop({ type: Object, default: {} })
  activityData: Record<string, any>;

  @Prop({ type: [ActivityProgressHistorySchema], default: [] })
  activityProgressHistoryData: ActivityProgressHistory[];

  @Prop()
  completedAt: Date;
}

export const UserActivityProgressSchema =
  SchemaFactory.createForClass(UserActivityProgress);

// Pre-save hook to auto-log progress snapshots
UserActivityProgressSchema.pre('save', function (next) {
  if (
    this.isModified('score') ||
    this.isModified('progress') ||
    this.isModified('timer') ||
    this.isModified('correctAttempts') ||
    this.isModified('wrongAttempts') ||
    this.isModified('questionsCount') ||
    this.isModified('status')
  ) {
    this.activityProgressHistoryData.push({
      score: this.score,
      progress: this.progress,
      timer: this.timer,
      correctAttempts: this.correctAttempts,
      wrongAttempts: this.wrongAttempts,
      questionsCount: this.questionsCount,
      status: this.status,
      updatedAt: new Date(),
    });
  }
  next();
});
