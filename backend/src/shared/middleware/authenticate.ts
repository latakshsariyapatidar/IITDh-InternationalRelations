import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import AppError from "../utils/appError.js";

interface JwtPayload {
  adminId: string;
  email: string;
  iat: number;
  exp: number;
}

export default async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("Authentication required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw AppError.unauthorized("Authentication required");
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw AppError.unauthorized("Invalid or expired token");
    }

    req.user = {
      adminId: decoded.adminId,
      email: decoded.email,
    };

    next();
  } catch (err) {
    next(err);
  }
}
