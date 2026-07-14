import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import AppError from "../utils/appError.js";

interface StudentJwtPayload {
  studentId: string;
  email: string;
  role: "student";
  iat: number;
  exp: number;
}

export default async function authenticateStudent(
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

    let decoded: StudentJwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as StudentJwtPayload;
      if (decoded.role !== "student") throw new Error("Wrong token type");
    } catch {
      throw AppError.unauthorized("Invalid or expired session");
    }

    req.student = { studentId: decoded.studentId, email: decoded.email };
    next();
  } catch (err) {
    next(err);
  }
}
