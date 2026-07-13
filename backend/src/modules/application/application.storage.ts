import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import type { Request } from "express";

type RequestWithSubmissionFolder = Request & { submissionFolder?: string };

export const PRIVATE_UPLOAD_ROOT = path.join(
  process.cwd(),
  "private-uploads",
  "applications",
);

fs.mkdirSync(PRIVATE_UPLOAD_ROOT, { recursive: true });

const ALLOWED_MIMES = new Set(["application/pdf", "image/jpeg", "image/png"]);

export const DOCUMENT_FIELDS = [
  "passportCopy",
  "photo",
  "academicTranscripts",
  "englishTestScoreCard",
  "statementOfPurpose",
  "financialProof",
  "recommendationLetter",
] as const;

export type DocumentField = (typeof DOCUMENT_FIELDS)[number];

const storage = multer.diskStorage({
  destination: (req: RequestWithSubmissionFolder, _file, cb) => {
    // multer calls `destination` once per file, not once per request — up to
    // 7 times for one submission. Memoize the UUID on `req` (the one object
    // shared across every file callback in this request) so all files land
    // in the same folder instead of each getting its own random one.
    if (!req.submissionFolder) {
      req.submissionFolder = crypto.randomUUID();
    }
    const dir = path.join(PRIVATE_UPLOAD_ROOT, req.submissionFolder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}${ext}`);
  },
});

export const applicationDocumentUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: DOCUMENT_FIELDS.length },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      cb(new Error("Only PDF, JPEG, or PNG files are accepted for application documents"));
      return;
    }
    cb(null, true);
  },
}).fields(DOCUMENT_FIELDS.map((name) => ({ name, maxCount: 1 })));
