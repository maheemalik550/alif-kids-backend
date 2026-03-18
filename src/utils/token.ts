import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export interface TokenPayload {
  id?: string;
  _id?: string;
  username?: string;
  inAppUserId?: string | string[] | null;
  email?: string;
  premiumSubscription?: boolean;
  role?: string;
  [key: string]: any;
}

export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export function generateTokens(payload: TokenPayload): GeneratedTokens {
  const accessSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_refresh_secret_change_me';
  const accessExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  const basePayload = {
    sub: payload.id || payload._id,
    id: payload.id || payload._id,
    username: payload.username,
    inAppUserId: payload.inAppUserId,
    email: payload.email,
    premiumSubscription: payload.premiumSubscription,
    role: payload.role,
  };

  const accessToken = jwt.sign(
    { ...basePayload, jti: randomUUID(), type: 'access' },
    accessSecret,
    { expiresIn: accessExpiresIn as jwt.SignOptions['expiresIn'] },
  );

  const refreshToken = jwt.sign(
    { ...basePayload, jti: randomUUID(), type: 'refresh' },
    refreshSecret,
    { expiresIn: refreshExpiresIn as jwt.SignOptions['expiresIn'] },
  );

  return { accessToken, refreshToken };
}
