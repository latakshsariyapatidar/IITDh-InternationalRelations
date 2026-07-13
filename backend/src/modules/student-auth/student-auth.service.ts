import jwt from "jsonwebtoken";
import { verifyGoogleIdToken } from "./student-auth.google.js";
import {
  upsertStudent,
  storeStudentRefreshToken,
  findStudentRefreshTokenByHash,
  deleteStudentRefreshToken,
} from "./student-auth.repository.js";
import { generateRefreshToken, hashToken } from "../../shared/utils/token.js";
import { env } from "../../config/env.js";
import AppError from "../../shared/utils/appError.js";
import type { StudentAuthTokens, StudentTokenPayload } from "./student-auth.types.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function signStudentAccessToken(payload: StudentTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
}

export async function loginWithGoogle(idToken: string): Promise<StudentAuthTokens> {
  const googleUser = await verifyGoogleIdToken(idToken);
  const student = await upsertStudent(googleUser);

  const accessToken = signStudentAccessToken({ studentId: student.id, email: student.email, role: "student" });
  const refreshToken = generateRefreshToken();
  await storeStudentRefreshToken(student.id, hashToken(refreshToken), new Date(Date.now() + REFRESH_TOKEN_TTL_MS));

  return { accessToken, refreshToken };
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

  const newAccessToken = signStudentAccessToken({
    studentId: stored.student.id,
    email: stored.student.email,
    role: "student",
  });
  const newRefreshToken = generateRefreshToken();
  await storeStudentRefreshToken(
    stored.student.id,
    hashToken(newRefreshToken),
    new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(incomingToken: string): Promise<void> {
  await deleteStudentRefreshToken(hashToken(incomingToken)).catch(() => {});
}
