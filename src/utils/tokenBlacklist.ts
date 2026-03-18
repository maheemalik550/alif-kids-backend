const tokenBlacklist = new Map<string, number>();
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function cleanupExpired(): void {
  const now = Date.now();
  for (const [jti, expiresAt] of tokenBlacklist.entries()) {
    if (expiresAt <= now) {
      tokenBlacklist.delete(jti);
    }
  }
}

export function addToBlacklist(jti: string, ttlMs: number = DEFAULT_TTL_MS): void {
  if (!jti) return;
  cleanupExpired();
  tokenBlacklist.set(jti, Date.now() + ttlMs);
}

export function isBlacklisted(jti: string): boolean {
  if (!jti) return false;
  cleanupExpired();
  const expiresAt = tokenBlacklist.get(jti);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    tokenBlacklist.delete(jti);
    return false;
  }
  return true;
}
