import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createGalleryImageSchema,
  updateGalleryImageSchema,
  galleryIdSchema,
  listGallerySchema,
} from "./gallery.schema.js";
import * as ctrl from "./gallery.controller.js";

const router: Router = Router();

router.get("/", cacheControl(300), validate({ query: listGallerySchema }), ctrl.listImages);
router.get("/:id", cacheControl(300), validate({ params: galleryIdSchema }), ctrl.getImage);
router.post(
  "/",
  authenticate,
  validate({ body: createGalleryImageSchema }),
  ctrl.createImage,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: galleryIdSchema, body: updateGalleryImageSchema }),
  ctrl.updateImage,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: galleryIdSchema }),
  ctrl.deleteImage,
);

export default router;
