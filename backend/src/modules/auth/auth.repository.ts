import { prisma } from "../../config/prisma.js";

export async function findAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      failedLoginAttempts: true,
      lockedUntil: true,
    },
  });
}

/**
 * Records a failed password attempt and locks the account once there have been
 * too many. Returns the row so the caller can see the new state.
 *
 * Per account, not per IP. The IP limiter in auth.rateLimit.ts stops one
 * machine hammering the endpoint, but it cannot see that a thousand machines
 * are each trying one password against the same known address — and it counts
 * in process memory, so it forgets everything on deploy and counts separately
 * in each replica. This counter is a column, so it does neither.
 */
export async function recordFailedLogin(
  adminId: string,
  attemptsSoFar: number,
  maxAttempts: number,
  lockDurationMs: number,
) {
  const attempts = attemptsSoFar + 1;
  const shouldLock = attempts >= maxAttempts;

  return prisma.admin.update({
    where: { id: adminId },
    data: {
      failedLoginAttempts: attempts,
      ...(shouldLock && { lockedUntil: new Date(Date.now() + lockDurationMs) }),
    },
    select: { failedLoginAttempts: true, lockedUntil: true },
  });
}

/** Clears the counter after a password that checked out. */
export async function recordSuccessfulLogin(adminId: string) {
  return prisma.admin.update({
    where: { id: adminId },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
    select: { id: true },
  });
}

export async function storeRefreshToken(
  adminId: string,
  tokenHash: string,
  expiresAt: Date,
  familyId?: string,
) {
  return prisma.refreshToken.create({
    data: { adminId, tokenHash, expiresAt, ...(familyId && { familyId }) },
  });
}

export async function findRefreshTokenByHash(tokenHash: string) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { admin: { select: { id: true, email: true } } },
  });
}

/**
 * Claims a refresh token: marks it used, but only if it is still live and has
 * not been claimed already.
 *
 * This single statement is the whole concurrency story. Rotation used to be
 * find, then delete, then insert — three round trips with no lock between
 * them, so two tabs refreshing at the same moment could both pass the find and
 * both be issued a session, and a retried request could delete a row the first
 * attempt had already deleted and surface as a 404 out of /auth/refresh.
 *
 * Postgres serialises the UPDATE on the row, so exactly one caller can see
 * `count === 1`. Everyone else loses, and losing is meaningful: it says the
 * token had already been spent.
 */
export async function claimRefreshToken(tokenHash: string, now: Date) {
  const { count } = await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null, expiresAt: { gt: now } },
    data: { revokedAt: now },
  });

  return count === 1;
}

/**
 * Deletes every token in a family. Used when a token is presented after it was
 * already rotated: the only way that happens outside a browser race is that a
 * copy of the cookie exists somewhere it should not, and there is no way to
 * tell the copy from the original — so the whole chain goes.
 */
export async function revokeTokenFamily(familyId: string) {
  return prisma.refreshToken.deleteMany({ where: { familyId } });
}

export async function deleteRefreshToken(tokenHash: string) {
  return prisma.refreshToken.deleteMany({ where: { tokenHash } });
}

export async function deleteAllRefreshTokensForAdmin(adminId: string) {
  return prisma.refreshToken.deleteMany({ where: { adminId } });
}

/**
 * Drops rows that can no longer authenticate anyone: expired, or revoked long
 * enough ago that keeping them for reuse detection no longer buys anything.
 * Called from the nightly cron — nothing deleted these before, so the table
 * only ever grew.
 */
export async function deleteSpentRefreshTokens(revokedBefore: Date) {
  const now = new Date();

  const [expired, revoked] = await Promise.all([
    prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.refreshToken.deleteMany({
      where: { revokedAt: { lt: revokedBefore } },
    }),
  ]);

  return expired.count + revoked.count;
}
