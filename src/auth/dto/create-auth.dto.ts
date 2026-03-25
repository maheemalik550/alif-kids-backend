import { IsEmail } from "class-validator";

export class CreateAuthDto {
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly inAppUserId?: string;
  readonly premiumSubscription: string;
  readonly voucherCode?: string;
}



export class ResendOtpDto {
  @IsEmail()
  email: string;
}
