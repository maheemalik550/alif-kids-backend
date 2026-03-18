import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateUserActivityProgressDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  activityId: string;

  @IsString()
  activityModel: string;

  @IsMongoId()
  episodeId: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsNumber()
  timer?: number;

  @IsOptional()
  @IsNumber()
  wrongAttempts?: number;

  @IsOptional()
  @IsNumber()
  correctAttempts?: number;

  @IsOptional()
  @IsNumber()
  questionsCount?: number;

  @IsOptional()
  activityData?: Record<string, any>;
}

export class UpdateUserActivityProgressDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsNumber()
  timer?: number;

  @IsOptional()
  @IsNumber()
  wrongAttempts?: number;

  @IsOptional()
  @IsNumber()
  correctAttempts?: number;

  @IsOptional()
  @IsNumber()
  questionsCount?: number;

  @IsOptional()
  activityData?: Record<string, any>;

  @IsOptional()
  completedAt?: Date;
}
