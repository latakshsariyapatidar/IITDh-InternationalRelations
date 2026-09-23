import type { Request } from "express";
import { prisma } from "../../config/prisma.js";

// An audit trail for the files that matter: passport scans, photographs,
// financial statements and signed agreements belonging to named people.
//
// Until this existed, nothing anywhere recorded that any of those had been
// opened. If an exported spreadsheet leaked — and the whole point of the
// signed links in it is that the sheet travels by email — there was no way to
// answer "were the documents actually fetched, which ones, and from where".
// A one-row-per-download log turns that from unanswerable into a query.
//
// Writing the log must never block or fail the download itself, so it is
// fire-and-forget: a failed insert is logged and dropped.

export type DocumentAccessScope =
  | "applications"
  | "inbound-exchange"
  | "outbound-applications"
  | "mous";

/**
 * Truncates to the column width rather than letting Postgres reject the row,
 * because a rejected row is a missing audit entry.
 */
const fit = (value: string | undefined, max: number): string | undefined =>
  value === undefined ? undefined : value.slice(0, max);

interface DocumentAccessEntry {
  scope: DocumentAccessScope;
  recordId: string;
  field: string;
}

/**
 * Records one successful document download.
 *
 * `req.user` present means an admin session; its absence on one of these
 * routes means the request was authorised by a signed link out of an exported
 * spreadsheet, with nobody signed in — which is precisely the case worth
 * keeping an address and a user agent for.
 */
export function recordDocumentAccess(
  req: Request,
  { scope, recordId, field }: DocumentAccessEntry,
): void {
  const admin = req.user;

  void prisma.documentAccessLog
    .create({
      data: {
        scope,
        recordId,
        field: fit(field, 64) ?? "unknown",
        method: admin ? "SESSION" : "SIGNED_LINK",
        actorEmail: fit(admin?.email, 255) ?? null,
        ipAddress: fit(req.ip, 64) ?? null,
        userAgent: fit(req.get("user-agent"), 400) ?? null,
      },
    })
    .catch((err: unknown) => {
      console.error("[AUDIT] Failed to record document access:", err);
    });
}
