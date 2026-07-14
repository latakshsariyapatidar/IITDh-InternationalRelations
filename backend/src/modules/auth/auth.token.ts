import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import type { TokenPayload } from "./auth.types.js";

export { generateRefreshToken, hashToken } from "../../shared/utils/token.js";

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
