import jwt from "jsonwebtoken";
import { verifyGoogleIdToken } from "./student-auth.google.js";
import {
  upsertStudent,
  findPortalFacultyByEmail,
  storeStudentRefreshToken,
  findStudentRefreshTokenByHash,
  deleteStudentRefreshToken,
} from "./student-auth.repository.js";
import { generateRefreshToken, hashToken } from "../../shared/utils/token.js";
import { REFRESH_TOKEN_TTL_MS } from "../../shared/utils/refreshCookie.js";
import { env } from "../../config/env.js";
import AppError from "../../shared/utils/appError.js";
import type { StudentAuthTokens, StudentTokenPayload } from "./student-auth.types.js";

function signStudentAccessToken(payload: StudentTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
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
  const refreshToken = generateRefreshToken();
  await storeStudentRefreshToken(student.id, hashToken(refreshToken), new Date(Date.now() + REFRESH_TOKEN_TTL_MS));

  return {
    accessToken,
    refreshToken,
    role: payload.role,
    ...(faculty && { faculty }),
  };
}

export async function refresh(incomingToken: string): Promise<StudentAuthTokens> {
  const tokenHash = hashToken(incomingToken);
  const stored = await findStudentRefreshTokenByHash(tokenHash);

  if (!stored) throw AppError.unauthorized("Invalid refresh token");
  if (stored.expiresAt < new Date()) {
    await deleteStudentRefreshToken(tokenHash);
    throw AppError.unauthorized("Session expired — please sign in again");
  }

  await deleteStudentRefreshToken(tokenHash);

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
