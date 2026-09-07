import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import authenticateIitdh from "../../shared/middleware/authenticateIitdh.js";
import cacheControl from "../../shared/middleware/cache.js";
import { mouDocumentUpload } from "./mou.storage.js";
import { createMouSchema, updateMouSchema, mouIdSchema, listMousSchema } from "./mou.schema.js";
import * as ctrl from "./mou.controller.js";

const router: Router = Router();

// Public — MOU records carry `hasDocument`, never the stored path.
router.get("/", cacheControl(300), validate({ query: listMousSchema }), ctrl.listMous);
router.get("/:id", cacheControl(300), validate({ params: mouIdSchema }), ctrl.getMou);

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
