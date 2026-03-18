import { IsNotEmpty, MinLength } from 'class-validator';

export class SetPasswordByTokenDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
