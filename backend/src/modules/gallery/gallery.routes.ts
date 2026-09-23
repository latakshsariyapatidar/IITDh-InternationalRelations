import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createGalleryImageSchema,
  updateGalleryImageSchema,
  galleryIdSchema,
  listGallerySchema,
} from "./gallery.schema.js";
import * as ctrl from "./gallery.controller.js";

const router: Router = Router();

// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(300), validate({ query: listGallerySchema }), ctrl.listImages);
router.get("/:id", optionalAuthenticate, cacheControl(300), validate({ params: galleryIdSchema }), ctrl.getImage);
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
