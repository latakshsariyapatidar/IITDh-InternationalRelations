// The file extension a stored upload gets, derived from its validated MIME
// type — never from `originalname`.
//
// `originalname` is attacker-controlled and independent of the MIME check: a
// multipart part can declare `Content-Type: application/pdf` while naming the
// file `evil.html`. Storing that name meant the document was later served as
// `text/html` from this origin, so opening an applicant's "passport copy" ran
// their script against the admin's session.

const MIME_EXTENSIONS: Readonly<Record<string, string>> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/**
 * Extension for an accepted MIME type, including the leading dot. Returns ""
 * for anything unrecognised: every upload path already rejects those in its
 * `fileFilter`, so an extensionless file here means a filter was widened
 * without adding the type below.
 */
export function extensionForMime(mimetype: string): string {
  return MIME_EXTENSIONS[mimetype.trim().toLowerCase()] ?? "";
}
