import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsEmail()
  email: string;

  @Optional()
  inAppUserId: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
