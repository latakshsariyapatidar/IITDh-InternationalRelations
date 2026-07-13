/**
 * src/middleware/errorHandler.ts
 *
 * Global error handling middleware
 * Catches all errors forwarded via next(err) and sends a structured response.
 *
 * Handles:
 *   - AppError         → operational errors thrown intentionally
 *   - ZodError         → request validation failures
 *   - Prisma P2002     → unique constraint violation (duplicate)
 *   - Prisma P2025     → record not found at DB level
 *   - Prisma P2003     → foreign key constraint failed
 *   - Unknown          → unexpected crashes → generic 500
 */

import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import multer from "multer";
import AppError, { type ValidationErrorDetail } from "../utils/appError.js";
import { env } from "../../config/env.js";

function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError,
): AppError {
  switch (err.code) {
    case "P2002": {
      const fields = (err.meta?.target as string[]) ?? ["field"];
      return AppError.conflict(
        `A record with this ${fields.join(", ")} already exists.`,
      );
    }
    case "P2025": {
      return AppError.notFound("The requested record does not exist.");
    }
    case "P2003": {
      const field = (err.meta?.field_name as string) ?? "related record";
      return AppError.badRequest(`Invalid reference: ${field} does not exist.`);
    }
    default:
      return AppError.internal();
  }
}

function handleZodError(err: ZodError): AppError {
  const details: ValidationErrorDetail[] = err.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return AppError.badRequest("Validation failed", details);
}

function sendDevError(
  res: Response,
  error: AppError,
  details?: ValidationErrorDetail[],
): void {
  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    ...(details && { errors: details }),
    stack: error.stack,
  });
}

function sendProdError(
  res: Response,
  error: AppError,
  details?: ValidationErrorDetail[],
): void {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
      ...(details && { errors: details }),
    });
  } else {
    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went wrong",
    });
  }
}

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(`[ERROR] ${req.method} ${req.path}`, err);

  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (
    err instanceof ZodError ||
    (err instanceof Error && err.name === "ZodError")
  ) {
    appError = handleZodError(err as ZodError);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    appError = AppError.internal();
  } else if (err instanceof multer.MulterError) {
    appError =
      err.code === "LIMIT_FILE_SIZE"
        ? AppError.badRequest("File is too large")
        : AppError.badRequest(`Upload error: ${err.message}`);
  } else {
    appError = AppError.internal();
  }

  if (env.NODE_ENV === "development") {
    sendDevError(res, appError, appError.details);
  } else {
    sendProdError(res, appError, appError.details);
  }
}
