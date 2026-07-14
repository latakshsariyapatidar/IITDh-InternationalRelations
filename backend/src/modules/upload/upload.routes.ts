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

router.delete("/", authenticate, ctrl.deleteUpload);

export default router;
