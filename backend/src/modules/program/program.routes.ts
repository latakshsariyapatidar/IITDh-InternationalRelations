import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createProgramSchema,
  updateProgramSchema,
  programIdSchema,
  listProgramsSchema,
} from "./program.schema.js";
import * as ctrl from "./program.controller.js";

const router: Router = Router();

// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(300), validate({ query: listProgramsSchema }), ctrl.listPrograms);
router.get("/:id", optionalAuthenticate, cacheControl(300), validate({ params: programIdSchema }), ctrl.getProgram);
router.post(
  "/",
  authenticate,
  validate({ body: createProgramSchema }),
  ctrl.createProgram,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: programIdSchema, body: updateProgramSchema }),
  ctrl.updateProgram,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: programIdSchema }),
  ctrl.deleteProgram,
);

export default router;
