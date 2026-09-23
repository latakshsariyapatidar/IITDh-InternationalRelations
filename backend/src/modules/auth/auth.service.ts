import bcrypt from "bcrypt";
import crypto from "node:crypto";
import {
  findAdminByEmail,
  recordFailedLogin,
  recordSuccessfulLogin,
  storeRefreshToken,
  findRefreshTokenByHash,
  claimRefreshToken,
  revokeTokenFamily,
  deleteRefreshToken,
  deleteAllRefreshTokensForAdmin,
} from "./auth.repository.js";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
} from "./auth.token.js";
import AppError from "../../shared/utils/appError.js";
import { REFRESH_TOKEN_TTL_MS } from "../../shared/utils/refreshCookie.js";
import type { LoginInput } from "./auth.schema.js";
import type { AuthTokens } from "./auth.types.js";

// Compared against when the email is unknown, so both branches spend the same
// ~100ms in bcrypt. Returning early for an unknown address would make the
// response time itself reveal which addresses have accounts.
const ABSENT_ADMIN_HASH = bcrypt.hashSync("no-account-with-this-address", 12);

/** Wrong passwords in a row before the account stops accepting any. */
const MAX_FAILED_LOGINS = 8;

/** How long the lock holds. Long enough to make guessing pointless, short
 * enough that a locked-out admin is not waiting on anyone to unlock them. */
const LOCK_DURATION_MS = 15 * 60 * 1000;

/**
 * A rotated token stays usable for this long before its reuse is read as
 * theft.
 *
 * Two browser tabs refreshing at the same moment, or one request retried after
 * a dropped connection, legitimately present the same cookie twice within a
 * second or two. Without this window those benign races would revoke the whole
 * family and sign the admin out — a reuse detector that fires on normal use
 * gets turned off, so it has to not fire on normal use.
 *
 * Beyond the window, a token that was already rotated is a copy.
 */
const REUSE_GRACE_MS = 30 * 1000;

export async function login(data: LoginInput): Promise<AuthTokens> {
  const admin = await findAdminByEmail(data.email);

  // Checked before the password: a locked account must not be a place to keep
  // guessing, and the answer must not depend on whether the guess was right.
  if (admin?.lockedUntil && admin.lockedUntil > new Date()) {
    throw AppError.unauthorized(
      "This account is temporarily locked after too many failed sign-in attempts. Try again shortly.",
    );
  }

  const isValid = await bcrypt.compare(
    data.password,
    admin?.passwordHash ?? ABSENT_ADMIN_HASH,
  );

  if (!admin || !isValid) {
    if (admin) {
      // The counter is reset by any successful sign-in, so a stale count from
      // an admin who simply mistyped last week never accumulates into a lock.
      await recordFailedLogin(
        admin.id,
        admin.lockedUntil ? 0 : admin.failedLoginAttempts,
        MAX_FAILED_LOGINS,
        LOCK_DURATION_MS,
      );
    }

    // One message for both failures: which of the two it was is not the
    // caller's business.
    throw AppError.unauthorized("Invalid email or password");
  }

  await recordSuccessfulLogin(admin.id);

  const accessToken = signAccessToken({
    adminId: admin.id,
    email: admin.email,
    role: "admin",
  });

  // A fresh sign-in starts a new family; every rotation from here carries this
  // id, so the chain can be revoked as a unit if one of its links is replayed.
  const refreshToken = generateRefreshToken();
  await storeRefreshToken(
    admin.id,
    hashToken(refreshToken),
    new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    crypto.randomUUID(),
  );

  return { accessToken, refreshToken };
}

export async function refresh(incomingToken: string): Promise<AuthTokens> {
  const tokenHash = hashToken(incomingToken);
  const now = new Date();
  const stored = await findRefreshTokenByHash(tokenHash);

  if (!stored) throw AppError.unauthorized("Invalid refresh token");

  if (stored.expiresAt < now) {
    await deleteRefreshToken(tokenHash);
    throw AppError.unauthorized("Refresh token expired — please log in again");
  }

  // Already rotated. Inside the grace window this is a tab race or a retry, so
  // the request is simply refused. Outside it, the cookie has been replayed
  // long after it was spent, which means a copy of it exists — and since the
  // copy is indistinguishable from the original, every session descended from
  // that sign-in is treated as compromised.
  if (stored.revokedAt) {
    const replayedLate =
      now.getTime() - stored.revokedAt.getTime() > REUSE_GRACE_MS;

    if (replayedLate) {
      await revokeTokenFamily(stored.familyId);
      console.warn(
        `[AUTH] Refresh token reuse detected for admin ${stored.adminId}; ` +
          "revoked the whole token family.",
      );
      throw AppError.unauthorized(
        "This session has been ended for security reasons. Please log in again.",
      );
    }

    throw AppError.unauthorized("Invalid refresh token");
  }

  // The claim is the authorisation check, not a step after it: if another
  // request got here first, this one never issues a session.
  const claimed = await claimRefreshToken(tokenHash, now);
  if (!claimed) throw AppError.unauthorized("Invalid refresh token");

  const newAccessToken = signAccessToken({
    adminId: stored.admin.id,
    email: stored.admin.email,
    role: "admin",
  });
  const newRefreshToken = generateRefreshToken();
  await storeRefreshToken(
    stored.admin.id,
    hashToken(newRefreshToken),
    new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    stored.familyId,
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(incomingToken: string): Promise<void> {
  await deleteRefreshToken(hashToken(incomingToken)).catch(() => {});
}

export async function logoutAll(adminId: string): Promise<void> {
  await deleteAllRefreshTokensForAdmin(adminId);
}
