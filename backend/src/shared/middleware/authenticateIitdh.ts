import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import AppError from "../utils/appError.js";
import type { CampusJwtPayload } from "./authenticateCampus.js";

interface AdminJwtPayload {
  adminId: string;
  email: string;
  role: "admin";
  iat: number;
  exp: number;
}

type AnyPayload = AdminJwtPayload | CampusJwtPayload;

/**
 * Accepts any IIT Dharwad identity — an admin token, or a campus token from the
 * Google sign-in that already enforces @iitdh.ac.in. Gates MOU documents
 * (Part 11): the MOU itself is public, the signed document is not.
 */
export default async function authenticateIitdh(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("Sign in with your IIT Dharwad account to view this document");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw AppError.unauthorized("Sign in with your IIT Dharwad account to view this document");
    }

    let decoded: AnyPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as AnyPayload;
    } catch {
      throw AppError.unauthorized("Invalid or expired session");
    }

    if (decoded.role === "admin") {
      req.user = { adminId: decoded.adminId, email: decoded.email };
    } else if (decoded.role === "student" || decoded.role === "faculty") {
      req.student = {
        studentId: decoded.studentId,
        email: decoded.email,
        role: decoded.role,
        ...(decoded.facultyId && { facultyId: decoded.facultyId }),
      };
    } else {
      throw AppError.unauthorized("Invalid or expired session");
    }

    next();
  } catch (err) {
    next(err);
  }
}
