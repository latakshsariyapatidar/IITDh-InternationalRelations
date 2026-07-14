import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createDownloadSchema,
  updateDownloadSchema,
  downloadIdSchema,
  listDownloadsSchema,
} from "./download.schema.js";
import * as ctrl from "./download.controller.js";

const router: Router = Router();

router.get("/", cacheControl(300), validate({ query: listDownloadsSchema }), ctrl.listDownloads);
router.get("/:id", cacheControl(300), validate({ params: downloadIdSchema }), ctrl.getDownload);
router.post(
  "/",
  authenticate,
  validate({ body: createDownloadSchema }),
  ctrl.createDownload,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: downloadIdSchema, body: updateDownloadSchema }),
  ctrl.updateDownload,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: downloadIdSchema }),
  ctrl.deleteDownload,
);

export default router;
