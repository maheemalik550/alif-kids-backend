export class CreateVoucherDto {
  readonly code: string;
  readonly description?: string;
  readonly expiryDate: Date;
  readonly maxUses?: number;
  readonly subscriptionType?: string;
  readonly notes?: string;
}
