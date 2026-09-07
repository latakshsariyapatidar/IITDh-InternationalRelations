import path from "node:path";
import type { Response } from "express";

/**
 * Serves a stored document as a download rather than as a page.
 *
 * Extensions now come from the validated MIME type, so a stored file can no
 * longer claim to be HTML. These documents still arrive from public forms
 * though, so the response is pinned shut as well: `attachment` stops a browser
 * rendering it on this origin, and `nosniff` stops it guessing a type the
 * extension does not claim.
 */
export function sendPrivateDocument(
  res: Response,
  absolutePath: string,
  downloadName?: string,
): void {
  // A caller-supplied name describes the record ("<id>-passportCopy"); the
  // extension still has to come off the stored file, or the download lands
  // without one and the office cannot open it.
  const stored = path.extname(absolutePath);
  const named = downloadName
    ? `${downloadName}${path.extname(downloadName) ? "" : stored}`
    : path.basename(absolutePath);

  // Quoted header value: anything outside this set — a quote, a newline —
  // would let a stored name break out of the header.
  const filename = named.replace(/[^A-Za-z0-9._-]+/g, "_");

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.sendFile(absolutePath);
}
