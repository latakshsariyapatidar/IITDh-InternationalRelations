import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import type { Request } from "express";
import AppError from "../../shared/utils/appError.js";
import { extensionForMime } from "../../shared/utils/mimeExtension.js";
import {
  UPLOAD_ROOT,
  IMAGE_FOLDERS,
  DOCUMENT_FOLDERS,
} from "../../shared/constants/upload.constants.js";

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_DOCUMENT_MIMES = new Set(["application/pdf"]);

function makeStorage(allowedFolders: readonly string[]) {
  return multer.diskStorage({
    destination: (req: Request, _file, cb) => {
      const folder = req.params.folder as string;
      if (!allowedFolders.includes(folder)) {
        cb(
          AppError.badRequest(
            `"folder" must be one of: ${allowedFolders.join(", ")}`,
          ),
          "",
        );
        return;
      }
      cb(null, path.join(UPLOAD_ROOT, folder));
    },
    filename: (_req, file, cb) => {
      // Extension from the validated MIME type, never from `originalname` —
      // see shared/utils/mimeExtension.ts.
      cb(null, `${crypto.randomUUID()}${extensionForMime(file.mimetype)}`);
    },
  });
}

export const imageUpload = multer({
  storage: makeStorage(IMAGE_FOLDERS),
  limits: { fileSize: 10 * 1024 * 1024 }, // increased to 10MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_MIMES.has(file.mimetype)) {
      cb(AppError.badRequest("Only JPEG, PNG, WEBP, or GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

export const documentUpload = multer({
  storage: makeStorage(DOCUMENT_FOLDERS),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_DOCUMENT_MIMES.has(file.mimetype)) {
      cb(AppError.badRequest("Only PDF documents are allowed"));
      return;
    }
    cb(null, true);
  },
});
