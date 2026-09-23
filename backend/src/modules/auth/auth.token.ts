import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SIGN_OPTIONS,
  ACCESS_TOKEN_VERIFY_OPTIONS,
} from "../../shared/utils/jwtOptions.js";
import { env } from "../../config/env.js";
import type { TokenPayload } from "./auth.types.js";

export { generateRefreshToken, hashToken } from "../../shared/utils/token.js";

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, ACCESS_TOKEN_SIGN_OPTIONS);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(
    token,
    env.JWT_SECRET,
    ACCESS_TOKEN_VERIFY_OPTIONS,
  ) as TokenPayload;
}
