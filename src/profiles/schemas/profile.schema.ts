import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, minlength: 1, maxlength: 50 })
  profileName: string;

  @Prop({ required: false, maxlength: 500 })
  profilePicture?: string;

  @Prop({ default: 'default', enum: ['default', 'child', 'parent'] })
  profileType: string;

  @Prop({ default: false })
  isKidsProfile: boolean;

  @Prop({ required: false, minlength: 4, maxlength: 8 })
  pin?: string;

  @Prop({ required: false, type: Date })
  birthdate?: Date;

  @Prop({ default: null })
  lastWatchedContent?: string;

  @Prop({
    type: {
      contentId: String,
      episodeId: String,
      timeStamp: Number,
    },
    default: null,
  })
  continueWatching?: {
    contentId: string;
    episodeId: string;
    timeStamp: number;
  };

  @Prop({ type: [String], default: [] })
  favorites: string[];

  @Prop({ type: [String], default: [] })
  watchlist: string[];

  @Prop({ type: [String], default: [] })
  viewingHistory: string[];

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: new Date() })
  lastUsedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
