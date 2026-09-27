import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";
import {
  fileMatchesDeclaredType,
  hasKnownSignature,
} from "../utils/fileSignature.js";

/** Every file multer attached to this request, whichever form it used. */
function uploadedFiles(req: Request): Express.Multer.File[] {
  const files: Express.Multer.File[] = [];

  if (req.file) files.push(req.file);

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files) {
    for (const group of Object.values(req.files)) files.push(...(group ?? []));
  }

  return files;
}

/**
 * Confirms each uploaded file's bytes match the type it declared. Mount
 * immediately after a multer middleware, before validation.
 *
 * This cannot live in multer's `fileFilter`: the filter runs while the part is
 * still arriving, so there are no bytes on disk to look at yet. Checking
 * afterwards means a rejected file was briefly written — that is fine, because
 * errorHandler discards everything multer wrote for any request that fails after
 * the upload, including the per-submission folder, and nothing has reached the
 * database on this path.
 */
export default async function verifyUploadContents(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    for (const file of uploadedFiles(req)) {
      if (!hasKnownSignature(file.mimetype)) {
        // A fileFilter accepted a type this checker does not know, which means a
        // filter was widened without a signature being added alongside it.
        // Logged for whoever did that; refused, because "cannot verify" must not
        // read as "verified".
        console.error(
          `[UPLOAD] No content signature registered for "${file.mimetype}" ` +
            `(field "${file.fieldname}"). Add one in shared/utils/fileSignature.ts.`,
        );
        throw AppError.badRequest(
          `Files of type "${file.mimetype}" are not accepted.`,
        );
      }

      if (!(await fileMatchesDeclaredType(file.path, file.mimetype))) {
        const claimed = file.mimetype.split("/")[1]?.toUpperCase() ?? "file";
        throw AppError.badRequest(
          `The file uploaded for "${file.fieldname}" is not a valid ${claimed}. ` +
            "Its contents do not match the file type it claims to be — please " +
            "re-save or re-scan it and try again.",
        );
      }
    }

    next();
  } catch (err) {
    next(err);
  }
}
