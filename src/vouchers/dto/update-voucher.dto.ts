export class UpdateVoucherDto {
  readonly description?: string;
  readonly expiryDate?: Date;
  readonly maxUses?: number;
  readonly isActive?: boolean;
  readonly subscriptionType?: string;
  readonly notes?: string;
}
