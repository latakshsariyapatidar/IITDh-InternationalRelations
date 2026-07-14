import bcrypt from "bcrypt";
import {
  findAdminByEmail,
  storeRefreshToken,
  findRefreshTokenByHash,
  deleteRefreshToken,
  deleteAllRefreshTokensForAdmin,
} from "./auth.repository.js";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
} from "./auth.token.js";
import AppError from "../../shared/utils/appError.js";
import type { LoginInput } from "./auth.schema.js";
import type { AuthTokens } from "./auth.types.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function login(data: LoginInput): Promise<AuthTokens> {
  const admin = await findAdminByEmail(data.email);

  if (!admin) throw AppError.unauthorized("Invalid email or password");

  const isValid = await bcrypt.compare(data.password, admin.passwordHash);
  if (!isValid) throw AppError.unauthorized("Invalid email or password");

  const accessToken = signAccessToken({
    adminId: admin.id,
    email: admin.email,
    role: "admin",
  });
  const refreshToken = generateRefreshToken();
  await storeRefreshToken(
    admin.id,
    hashToken(refreshToken),
    new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  );

  return { accessToken, refreshToken };
}

export async function refresh(incomingToken: string): Promise<AuthTokens> {
  const tokenHash = hashToken(incomingToken);
  const stored = await findRefreshTokenByHash(tokenHash);

  if (!stored) throw AppError.unauthorized("Invalid refresh token");
  if (stored.expiresAt < new Date()) {
    await deleteRefreshToken(tokenHash);
    throw AppError.unauthorized("Refresh token expired — please log in again");
  }

  await deleteRefreshToken(tokenHash);

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
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(incomingToken: string): Promise<void> {
  await deleteRefreshToken(hashToken(incomingToken)).catch(() => {});
}

export async function logoutAll(adminId: string): Promise<void> {
  await deleteAllRefreshTokensForAdmin(adminId);
}
