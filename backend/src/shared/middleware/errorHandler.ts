/**
 * src/shared/middleware/errorHandler.ts
 *
 * The single place an error becomes an HTTP response.
 *
 * Express identifies an error handler by its arity (four parameters), and it
 * only runs for errors that reach the end of the stack, so this must stay
 * registered last in app.ts.
 *
 * Handles:
 *   - already-sent responses → hand back to Express, which closes the socket
 *   - AppError            → operational errors thrown deliberately
 *   - http-errors         → body-parser and other middleware, status preserved
 *   - ZodError            → request validation failures
 *   - MulterError         → upload limits
 *   - Prisma P2002/P2025/P2003/P2000/P2011/P2014
 *   - anything else       → a generic 500, with the detail kept off the wire
 */

import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import multer from "multer";
import AppError, { type ValidationErrorDetail } from "../utils/appError.js";
import { discardUploadedFiles } from "../utils/privateStorage.js";
import { env } from "../../config/env.js";

/**
 * The shape http-errors attaches, which `express.json` and several other
 * middlewares throw: a malformed body is a 400, one over the 100 kB ceiling is
 * a 413, an unsupported charset is a 415.
 *
 * `expose` is the library's own statement that the message is safe to return —
 * it is true for 4xx and false for 5xx. Honouring both fields is what stops a
 * client's own mistake being reported as a server fault.
 */
function asHttpError(err: unknown): AppError | null {
  if (typeof err !== "object" || err === null) return null;

  const candidate = err as {
    status?: unknown;
    statusCode?: unknown;
    expose?: unknown;
    message?: unknown;
  };

  const status =
    typeof candidate.status === "number"
      ? candidate.status
      : typeof candidate.statusCode === "number"
        ? candidate.statusCode
        : null;

  if (status === null || status < 400 || status > 599) return null;
  if (candidate.expose !== true) return null;
  if (typeof candidate.message !== "string" || candidate.message === "") {
    return null;
  }

  return new AppError(candidate.message, status);
}

function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError,
  req: Request,
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
      // One code, two opposite meanings. On an insert or update the row points
      // at a parent that is not there. On a delete the row *is* the parent and
      // something still references it — reporting that as "does not exist" sent
      // admins hunting for a missing record that was never missing.
      if (req.method === "DELETE") {
        return AppError.conflict(
          "This record is still referenced by other records and cannot be deleted. " +
            "Remove or reassign those first.",
        );
      }

      const field = (err.meta?.field_name as string) ?? "related record";
      return AppError.badRequest(`Invalid reference: ${field} does not exist.`);
    }

    case "P2000": {
      const column = (err.meta?.column_name as string) ?? "A value";
      return AppError.badRequest(`${column} is too long for this field.`);
    }

    case "P2011": {
      const constraint = (err.meta?.constraint as string) ?? "A required field";
      return AppError.badRequest(`${constraint} must not be empty.`);
    }

    case "P2014": {
      return AppError.conflict(
        "This change would break a required relationship between records.",
      );
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

function handleMulterError(err: multer.MulterError): AppError {
  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      // Name the field. An applicant uploading seven documents cannot act on
      // "File is too large" — they have no idea which one to re-scan.
      return AppError.badRequest(
        err.field
          ? `The file uploaded for "${err.field}" is too large. Please upload a smaller scan or photo.`
          : "File is too large. Please upload a smaller scan or photo.",
      );
    case "LIMIT_FILE_COUNT":
    case "LIMIT_PART_COUNT":
      return AppError.badRequest("Too many files in this submission");
    case "LIMIT_UNEXPECTED_FILE":
      return AppError.badRequest(
        `Unexpected file field "${err.field ?? ""}" in this submission`,
      );
    default:
      return AppError.badRequest(`Upload error: ${err.message}`);
  }
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
  next: NextFunction,
): void {
  // Something already began writing this response — a streamed spreadsheet, a
  // `sendFile` that failed partway. The status line is gone, so there is no
  // response left to shape; Express's default handler closes the connection.
  if (res.headersSent) {
    next(err);
    return;
  }

  // Multer writes uploads to disk before validation runs, so a request that
  // fails anywhere after that point has already left files behind. Nothing has
  // been persisted to the database on this path, so they are unreferenced.
  if (req.file || req.files) {
    void discardUploadedFiles(req).catch((cleanupErr: unknown) => {
      console.error(
        "[ERROR] Failed to discard uploads for a failed request:",
        cleanupErr,
      );
    });
  }

  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (
    err instanceof ZodError ||
    (err instanceof Error && err.name === "ZodError")
  ) {
    appError = handleZodError(err as ZodError);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(err, req);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    appError = AppError.internal();
  } else if (err instanceof multer.MulterError) {
    appError = handleMulterError(err);
  } else {
    // Checked last so a deliberate AppError is never re-read through the
    // http-errors lens; everything reaching here is somebody else's error
    // object, and only the ones that describe themselves as client faults are
    // trusted to set the status.
    appError = asHttpError(err) ?? AppError.internal();
  }

  // A 4xx is the caller's mistake and routine; logging it at error level
  // buried the 5xxs that actually need attention. Only unexpected faults get
  // the stack.
  if (appError.statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  } else {
    console.warn(
      `[WARN] ${req.method} ${req.originalUrl} → ${appError.statusCode}: ${appError.message}`,
    );
  }

  if (env.NODE_ENV === "development") {
    sendDevError(res, appError, appError.details);
  } else {
    sendProdError(res, appError, appError.details);
  }
}
