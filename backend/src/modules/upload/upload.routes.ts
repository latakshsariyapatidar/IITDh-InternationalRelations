import { Router } from "express";
import { z } from "zod";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import { imageUpload, documentUpload } from "./upload.middleware.js";
import {
  IMAGE_FOLDERS,
  DOCUMENT_FOLDERS,
} from "../../shared/constants/upload.constants.js";
import * as ctrl from "./upload.controller.js";

const router: Router = Router();

const imageFolderParamSchema = z.object({ folder: z.enum(IMAGE_FOLDERS) });

// DELETE /uploads?url=... was the one route on this API with no validation at
// all: it took whatever string arrived and handed it to path.resolve. The
// containment check in the controller caught traversal, but nothing described
// what a legitimate value looks like — so "is this even a file we serve?" was
// never asked. This says it exactly: /uploads/<known folder>/<plain filename>.
const UPLOADABLE_FOLDERS = [...IMAGE_FOLDERS, ...DOCUMENT_FOLDERS] as const;

const deleteUploadQuerySchema = z.object({
  url: z
    .string()
    .trim()
    .max(300)
    .refine(
      (value) => {
        const match = /^\/uploads\/([a-z-]+)\/([A-Za-z0-9][A-Za-z0-9._-]*)$/.exec(
          value,
        );
        if (!match) return false;

        const [, folder, filename] = match;
        // No "..", and no leading dot: both are ways to name something other
        // than the file the URL appears to describe.
        if (filename!.includes("..")) return false;

        return (UPLOADABLE_FOLDERS as readonly string[]).includes(folder!);
      },
      { error: "url must be an /uploads/<folder>/<file> path served by this API" },
    ),
});
const documentFolderParamSchema = z.object({ folder: z.enum(DOCUMENT_FOLDERS) });

router.post(
  "/image/:folder",
  authenticate,
  validate({ params: imageFolderParamSchema }),
  imageUpload.single("file"),
  ctrl.uploadImage,
);

router.post(
  "/document/:folder",
  authenticate,
  validate({ params: documentFolderParamSchema }),
  documentUpload.single("file"),
  ctrl.uploadDocument,
);

router.delete(
  "/",
  authenticate,
  validate({ query: deleteUploadQuerySchema }),
  ctrl.deleteUpload,
);

export default router;
