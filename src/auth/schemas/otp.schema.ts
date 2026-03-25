import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserOtp extends Document {
    @Prop({ required: true })
    otp: string;

    @Prop({ required: true })
    email: string;

    @Prop({
        type: Date,
        default: Date.now,
        expires: 60 * 5, // document auto delete after 5 minutes
    })
    createdAt: Date;
}

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);