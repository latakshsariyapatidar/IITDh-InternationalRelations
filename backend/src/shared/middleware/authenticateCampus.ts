import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_VERIFY_OPTIONS } from "../utils/jwtOptions.js";
import { env } from "../../config/env.js";
import AppError from "../utils/appError.js";

// One Google sign-in serves both campus roles: the token says
// "faculty" when the verified @iitdh.ac.in address matches an active row in the
// faculty directory, and "student" otherwise. Routes pick which roles they
// accept — outbound applications stay student-only, the faculty portal is
// faculty-only, and opportunities accept either.

export type CampusRole = "student" | "faculty";

export interface CampusJwtPayload {
  studentId: string;
  email: string;
  role: CampusRole;
  facultyId?: string;
  iat: number;
  exp: number;
}

/** Verifies a campus token and narrows it to the roles a route accepts. */
export function requireCampusRole(...allowed: readonly CampusRole[]) {
  return async function campusAuth(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw AppError.unauthorized("Sign-in required");
      }

      const token = authHeader.split(" ")[1];
      if (!token) throw AppError.unauthorized("Sign-in required");

      let decoded: CampusJwtPayload;

      try {
        decoded = jwt.verify(
          token,
          env.JWT_SECRET,
          ACCESS_TOKEN_VERIFY_OPTIONS,
        ) as CampusJwtPayload;
        if (decoded.role !== "student" && decoded.role !== "faculty") {
          throw new Error("Wrong token type");
        }
      } catch {
        throw AppError.unauthorized("Invalid or expired session");
      }

      // A valid session in the wrong role is a 403, not a 401 — signing in
      // again would not help.
      if (!allowed.includes(decoded.role)) {
        throw AppError.forbidden("Your account does not have access to this resource");
      }

      req.student = {
        studentId: decoded.studentId,
        email: decoded.email,
        role: decoded.role,
        ...(decoded.facultyId && { facultyId: decoded.facultyId }),
      };
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default requireCampusRole("student", "faculty");
