import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';

export class CreateSubscriptionEventDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  userEmail?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  packageName?: string;

  @IsEnum(['subscribed', 'renewed', 'cancelled', 'expired', 'upgraded', 'downgraded'])
  @IsOptional()
  eventType?: string = 'subscribed';

  @IsEnum(['pending', 'active', 'completed', 'failed'])
  @IsOptional()
  status?: string = 'active';

  @IsOptional()
  @IsDate()
  subscribedAt?: Date;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
