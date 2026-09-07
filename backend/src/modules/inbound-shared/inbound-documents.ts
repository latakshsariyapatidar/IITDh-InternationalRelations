import path from "node:path";
import type { Request, Response, NextFunction } from "express";
import AppError from "../../shared/utils/appError.js";
import { verifyDocumentLink } from "../../shared/utils/signedLink.js";

// Both inbound registers (and outbound) store one document per form field, in a
// column named `<field>Path`. That convention is what lets one helper resolve
// any document for any of them.

export const documentPathColumn = (field: string): string => `${field}Path`;

/**
 * Any one stored document path on a record, or null when none were submitted.
 *
 * Every document for a submission shares one folder, so any path identifies it
 * — but which fields are filled varies, and naming two of them explicitly meant
 * a record with only, say, transcripts was deleted while its files stayed on
 * disk.
 */
export function anyDocumentPath(
  record: Record<string, unknown>,
  fields: readonly string[],
): string | null {
  for (const field of fields) {
    const value = record[documentPathColumn(field)];
    if (typeof value === "string" && value !== "") return value;
  }

  return null;
}

/**
 * Absolute path on disk for one uploaded document, or a 404 when the applicant
 * did not submit that one.
 */
export function resolveDocumentAbsolutePath(
  uploadRoot: string,
  record: Record<string, unknown>,
  field: string,
): string {
  const relativePath = record[documentPathColumn(field)];

  if (typeof relativePath !== "string" || relativePath === "") {
    throw AppError.notFound("This document was not submitted with the application");
  }

  return path.join(uploadRoot, relativePath);
}

/**
 * Lets a document route serve two callers: an admin holding a bearer token (set
 * by `optionalAuthenticate`), and a link clicked out of an exported spreadsheet,
 * which carries a signed `exp`/`sig` pair instead of a header.
 *
 * Mount after `optionalAuthenticate` and after params are validated.
 */
export function allowAdminOrSignedLink(scope: string) {
  return function documentAccessGuard(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    if (req.user) {
      next();
      return;
    }

    // Express types params as string | string[]; these two come from a
    // single-segment route, so they are always strings here.
    const id = req.params.id as string | undefined;
    const field = req.params.field as string | undefined;

    if (id && field && verifyDocumentLink(scope, id, field, req.query.exp, req.query.sig)) {
      next();
      return;
    }

    next(
      AppError.unauthorized(
        "This document link is invalid or has expired. Sign in, or export the sheet again for fresh links.",
      ),
    );
  };
}
