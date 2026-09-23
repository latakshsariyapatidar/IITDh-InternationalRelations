import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_VERIFY_OPTIONS } from "../utils/jwtOptions.js";
import { env } from "../../config/env.js";

interface JwtPayload {
  adminId: string;
  email: string;
  role: "admin";
  iat: number;
  exp: number;
}

/**
 * Same check as `authenticate`, but never rejects: sets `req.user` when a valid
 * admin token is present and otherwise continues anonymously. Lets one public
 * route widen its results for admins — e.g. announcements past their visibility
 * date stay hidden from the public but remain visible in the admin panel.
 */
export default async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          env.JWT_SECRET,
          ACCESS_TOKEN_VERIFY_OPTIONS,
        ) as JwtPayload;
        if (decoded.role === "admin") {
          req.user = { adminId: decoded.adminId, email: decoded.email };
        }
      } catch {
        // An invalid or expired token is treated as "not signed in" rather than
        // an error — this route is public either way.
      }
    }
  }

  next();
}
