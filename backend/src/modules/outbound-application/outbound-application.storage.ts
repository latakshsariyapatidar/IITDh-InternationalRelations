import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import type { Request } from "express";

export const OUTBOUND_UPLOAD_ROOT = path.join(
  process.cwd(),
  "private-uploads",
  "outbound-applications",
);

fs.mkdirSync(OUTBOUND_UPLOAD_ROOT, { recursive: true });

const ALLOWED_MIMES = new Set(["application/pdf", "image/jpeg", "image/png"]);

export const OUTBOUND_DOCUMENT_FIELDS = [
  "transcript",
  "recommendationLetter",
] as const;

export type OutboundDocumentField = (typeof OUTBOUND_DOCUMENT_FIELDS)[number];

type RequestWithSubmissionFolder = Request & { submissionFolder?: string };

const storage = multer.diskStorage({
  destination: (req: RequestWithSubmissionFolder, _file, cb) => {
    // multer calls `destination` once per file, not once per request. Memoize
    // the UUID on `req` so all files from one submission share one folder —
    // see application.storage.ts for the same fix and why it's needed.
    if (!req.submissionFolder) {
      req.submissionFolder = crypto.randomUUID();
    }
    const dir = path.join(OUTBOUND_UPLOAD_ROOT, req.submissionFolder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}${ext}`);
  },
});

export const outboundDocumentUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: OUTBOUND_DOCUMENT_FIELDS.length },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      cb(new Error("Only PDF, JPEG, or PNG files are accepted"));
      return;
    }
    cb(null, true);
  },
}).fields(OUTBOUND_DOCUMENT_FIELDS.map((name) => ({ name, maxCount: 1 })));
