import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import authenticateIitdh from "../../shared/middleware/authenticateIitdh.js";
import cacheControl from "../../shared/middleware/cache.js";
import { mouDocumentUpload } from "./mou.storage.js";
import { createMouSchema, updateMouSchema, mouIdSchema, listMousSchema } from "./mou.schema.js";
import * as ctrl from "./mou.controller.js";

const router: Router = Router();

// Public — MOU records carry `hasDocument`, never the stored path.
// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(300), validate({ query: listMousSchema }), ctrl.listMous);
router.get("/:id", optionalAuthenticate, cacheControl(300), validate({ params: mouIdSchema }), ctrl.getMou);

// The signed document itself: MOU -> sign in with an IIT Dharwad account ->
// document. Accepts an admin token or a campus (student/faculty) token.
router.get(
  "/:id/document",
  authenticateIitdh,
  validate({ params: mouIdSchema }),
  ctrl.downloadMouDocument,
);

// Admin.
router.post("/", authenticate, validate({ body: createMouSchema }), ctrl.createMou);
router.patch("/:id", authenticate, validate({ params: mouIdSchema, body: updateMouSchema }), ctrl.updateMou);
router.post(
  "/:id/document",
  authenticate,
  validate({ params: mouIdSchema }),
  mouDocumentUpload,
  ctrl.uploadMouDocument,
);
router.delete("/:id", authenticate, validate({ params: mouIdSchema }), ctrl.deleteMou);

export default router;
