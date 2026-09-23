import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SIGN_OPTIONS } from "../../shared/utils/jwtOptions.js";
import crypto from "node:crypto";
import { verifyGoogleIdToken } from "./student-auth.google.js";
import {
  upsertStudent,
  findPortalFacultyByEmail,
  storeStudentRefreshToken,
  findStudentRefreshTokenByHash,
  claimStudentRefreshToken,
  revokeStudentTokenFamily,
  deleteStudentRefreshToken,
} from "./student-auth.repository.js";
import { generateRefreshToken, hashToken } from "../../shared/utils/token.js";
import { REFRESH_TOKEN_TTL_MS } from "../../shared/utils/refreshCookie.js";
import { env } from "../../config/env.js";
import AppError from "../../shared/utils/appError.js";
import type { StudentAuthTokens, StudentTokenPayload } from "./student-auth.types.js";

/**
 * Window in which a rotated token is a browser race rather than a replay.
 * Mirrors REUSE_GRACE_MS on the admin side; see modules/auth/auth.service.ts
 * for why a reuse detector has to tolerate concurrent tabs.
 */
const REUSE_GRACE_MS = 30 * 1000;

function signStudentAccessToken(payload: StudentTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, ACCESS_TOKEN_SIGN_OPTIONS);
}

/**
 * Resolves which campus role an @iitdh.ac.in address signs in as. Google
 * verification already restricts the domain; this only decides whether the
 * account also appears in the faculty directory.
 */
async function resolveCampusIdentity(accountId: string, email: string) {
  const faculty = await findPortalFacultyByEmail(email);

  const payload: StudentTokenPayload = faculty
    ? { studentId: accountId, email, role: "faculty", facultyId: faculty.id }
    : { studentId: accountId, email, role: "student" };

  return { payload, faculty };
}

export async function loginWithGoogle(idToken: string): Promise<StudentAuthTokens> {
  const googleUser = await verifyGoogleIdToken(idToken);
  const student = await upsertStudent(googleUser);
  const { payload, faculty } = await resolveCampusIdentity(student.id, student.email);

  const accessToken = signStudentAccessToken(payload);
  // A fresh sign-in opens a new token family.
  const refreshToken = generateRefreshToken();
  await storeStudentRefreshToken(
    student.id,
    hashToken(refreshToken),
    new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    crypto.randomUUID(),
  );

  return {
    accessToken,
    refreshToken,
    role: payload.role,
    ...(faculty && { faculty }),
  };
}

export async function refresh(incomingToken: string): Promise<StudentAuthTokens> {
  const tokenHash = hashToken(incomingToken);
  const now = new Date();
  const stored = await findStudentRefreshTokenByHash(tokenHash);

  if (!stored) throw AppError.unauthorized("Invalid refresh token");

  if (stored.expiresAt < now) {
    await deleteStudentRefreshToken(tokenHash);
    throw AppError.unauthorized("Session expired — please sign in again");
  }

  // Presented after it was already rotated: a race inside the grace window,
  // a replayed copy outside it.
  if (stored.revokedAt) {
    if (now.getTime() - stored.revokedAt.getTime() > REUSE_GRACE_MS) {
      await revokeStudentTokenFamily(stored.familyId);
      console.warn(
        `[AUTH] Campus refresh token reuse detected for student ${stored.studentId}; ` +
          "revoked the whole token family.",
      );
      throw AppError.unauthorized(
        "This session has been ended for security reasons. Please sign in again.",
      );
    }

    throw AppError.unauthorized("Invalid refresh token");
  }

  // Claiming the token IS the check — one statement, so only one concurrent
  // request can win it.
  const claimed = await claimStudentRefreshToken(tokenHash, now);
  if (!claimed) throw AppError.unauthorized("Invalid refresh token");

  // Re-resolved on every refresh, so adding or removing someone from the
  // faculty directory takes effect without them signing in again.
  const { payload, faculty } = await resolveCampusIdentity(
    stored.student.id,
    stored.student.email,
  );

  const newAccessToken = signStudentAccessToken(payload);
  const newRefreshToken = generateRefreshToken();
  await storeStudentRefreshToken(
    stored.student.id,
    hashToken(newRefreshToken),
    new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    stored.familyId,
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    role: payload.role,
    ...(faculty && { faculty }),
  };
}

export async function logout(incomingToken: string): Promise<void> {
  await deleteStudentRefreshToken(hashToken(incomingToken)).catch(() => {});
}
