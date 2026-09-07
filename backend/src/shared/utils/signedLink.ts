import crypto from "node:crypto";
import { env } from "../../config/env.js";

// A document link pasted into an exported spreadsheet is opened by clicking it
// in Excel — there is no way to attach an `Authorization` header to that. So
// instead of the bearer token the admin routes use, export links carry an
// expiry and an HMAC over (scope, id, field, expiry). The signature is
// unforgeable without EXPORT_LINK_SECRET and the link stops working on its own
// after EXPORT_LINK_TTL_DAYS, so a leaked sheet does not leak the documents
// forever. That key is deliberately separate from the one signing access
// tokens: rotating either should not silently invalidate the other.

const SEPARATOR = ":";

function computeSignature(
  scope: string,
  id: string,
  field: string,
  exp: number,
): string {
  return crypto
    .createHmac("sha256", env.EXPORT_LINK_SECRET)
    .update([scope, id, field, String(exp)].join(SEPARATOR))
    .digest("base64url");
}

/**
 * Absolute, self-authenticating URL for one uploaded document. `scope` is the
 * route segment the document lives under, e.g. "applications".
 */
export function signDocumentLink(
  scope: string,
  id: string,
  field: string,
): string {
  const exp =
    Math.floor(Date.now() / 1000) + env.EXPORT_LINK_TTL_DAYS * 24 * 60 * 60;
  const sig = computeSignature(scope, id, field, exp);
  const query = new URLSearchParams({ exp: String(exp), sig });

  // Must be the public HTTP base, never DATABASE_URL — these URLs are written
  // into exported spreadsheets that get emailed around.
  return `${env.PUBLIC_API_BASE_URL}/api/v1/${scope}/${id}/documents/${field}?${query.toString()}`;
}

/** True only for a signature this server produced that has not yet expired. */
export function verifyDocumentLink(
  scope: string,
  id: string,
  field: string,
  exp: unknown,
  sig: unknown,
): boolean {
  if (typeof exp !== "string" || typeof sig !== "string") return false;

  const expiry = Number(exp);
  if (!Number.isInteger(expiry) || expiry * 1000 < Date.now()) return false;

  const expected = Buffer.from(computeSignature(scope, id, field, expiry));
  const received = Buffer.from(sig);

  // timingSafeEqual throws on a length mismatch, so guard before calling it.
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}
