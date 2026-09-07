import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { PRIVATE_UPLOADS_BASE } from "../../shared/utils/privateStorage.js";
import { extensionForMime } from "../../shared/utils/mimeExtension.js";

// MOU documents used to live under the public `uploads/` tree, which Express
// serves statically to anyone. They are signed institutional agreements, so
// they now sit in private storage and are only reachable through the
// authenticated download route.

export const MOU_UPLOAD_ROOT = path.join(PRIVATE_UPLOADS_BASE, "mous");

fs.mkdirSync(MOU_UPLOAD_ROOT, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, MOU_UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    // Extension from the validated MIME type, never from `originalname` —
    // see shared/utils/mimeExtension.ts.
    cb(null, `${crypto.randomUUID()}${extensionForMime(file.mimetype)}`);
  },
});

export const mouDocumentUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF documents are accepted for MOUs"));
      return;
    }
    cb(null, true);
  },
}).single("file");
