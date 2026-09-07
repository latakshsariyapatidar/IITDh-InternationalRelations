import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import type { Request } from "express";
import { extensionForMime } from "./mimeExtension.js";

// Every form that accepts uploads (inbound admission, inbound exchange,
// outbound) stores files the same way: one folder per submission, under
// private-uploads/, named by the form field. This factory is that shape.

export const PRIVATE_UPLOADS_BASE = path.join(process.cwd(), "private-uploads");

export const DEFAULT_ALLOWED_MIMES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

type RequestWithSubmissionFolder = Request & { submissionFolder?: string };

export interface PrivateUploadOptions {
  /** Folder under private-uploads/, e.g. "applications". */
  folder: string;
  /** Accepted form field names; one file each. */
  fields: readonly string[];
  allowedMimes?: Set<string>;
  maxFileSizeBytes?: number;
  rejectionMessage?: string;
}

/**
 * Builds the upload root and a multer middleware for one submission form.
 * Returns the root so callers can resolve stored relative paths back to disk.
 */
export function createPrivateUpload({
  folder,
  fields,
  allowedMimes = DEFAULT_ALLOWED_MIMES,
  maxFileSizeBytes = 10 * 1024 * 1024,
  rejectionMessage = "Only PDF, JPEG, or PNG files are accepted",
}: PrivateUploadOptions) {
  const root = path.join(PRIVATE_UPLOADS_BASE, folder);
  fs.mkdirSync(root, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req: RequestWithSubmissionFolder, _file, cb) => {
      // multer calls `destination` once per file, not once per request — up to
      // one call per field for a single submission. Memoize the UUID on `req`
      // (the one object shared across every file callback in this request) so
      // all files land in the same folder instead of each getting its own.
      if (!req.submissionFolder) {
        req.submissionFolder = crypto.randomUUID();
      }
      const dir = path.join(root, req.submissionFolder);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      // Extension from the validated MIME type, never from `originalname` —
      // see mimeExtension.ts.
      cb(null, `${file.fieldname}${extensionForMime(file.mimetype)}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxFileSizeBytes, files: fields.length },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimes.has(file.mimetype)) {
        cb(new Error(rejectionMessage));
        return;
      }
      cb(null, true);
    },
  }).fields(fields.map((name) => ({ name, maxCount: 1 })));

  return { root, upload };
}

/**
 * Maps multer's per-field file arrays to the relative paths stored in the
 * database (relative to `root`, so the upload directory can be relocated).
 */
export function collectDocumentPaths(
  root: string,
  files: Partial<Record<string, Express.Multer.File[]>>,
): Record<string, string> {
  const documentPaths: Record<string, string> = {};

  for (const [field, fileArray] of Object.entries(files)) {
    const file = fileArray?.[0];
    if (file) documentPaths[field] = path.relative(root, file.path);
  }

  return documentPaths;
}

/**
 * Deletes whatever multer already wrote for a request that then failed.
 *
 * Multer has to consume the multipart body before any validation can run, so
 * files reach disk first and a rejected submission — a zod failure, a missing
 * statement of purpose, an unknown record id — would otherwise leave its
 * uploads behind permanently.
 */
export async function discardUploadedFiles(req: Request): Promise<void> {
  const files: Express.Multer.File[] = [];

  if (req.file) files.push(req.file);

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files) {
    for (const group of Object.values(req.files)) files.push(...(group ?? []));
  }

  if (files.length === 0) return;

  await Promise.all(
    files.map((file) => fs.promises.rm(file.path, { force: true }).catch(() => {})),
  );

  // Private-upload forms give each submission its own folder; drop the now
  // empty directory too rather than accumulating them.
  if ((req as RequestWithSubmissionFolder).submissionFolder) {
    await fs.promises
      .rm(path.dirname(files[0]!.path), { recursive: true, force: true })
      .catch(() => {});
  }
}

/**
 * Removes the whole submission folder for a deleted record. `anyStoredPath` is
 * any one of its document paths — they all share a folder by construction.
 */
export async function removeSubmissionFolder(
  root: string,
  anyStoredPath: string | null | undefined,
): Promise<void> {
  if (!anyStoredPath) return;

  const submissionFolder = anyStoredPath.split(path.sep)[0];
  if (!submissionFolder) return;

  await fs.promises
    .rm(path.join(root, submissionFolder), { recursive: true, force: true })
    .catch(() => {});
}
