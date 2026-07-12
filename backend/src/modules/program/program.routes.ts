import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import {
  createProgramSchema,
  updateProgramSchema,
  programIdSchema,
  listProgramsSchema,
} from "./program.schema.js";
import * as ctrl from "./program.controller.js";

const router: Router = Router();

router.get("/", validate({ query: listProgramsSchema }), ctrl.listPrograms);
router.get("/:id", validate({ params: programIdSchema }), ctrl.getProgram);
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
