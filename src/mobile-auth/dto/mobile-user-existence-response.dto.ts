export class MobileUserExistenceResponseDto {
  success: boolean;
  message: string;
  exists: boolean;
  user?: {
    _id: string;
    deviceId: string;
    username?: string;
    email?: string;
    mobileNumber?: string;
    inAppUserId?: string;
    isVerified: boolean;
    premiumSubscription: boolean;
    isAccountDeleted: boolean;
    appVersion?: string;
    osType?: string;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
