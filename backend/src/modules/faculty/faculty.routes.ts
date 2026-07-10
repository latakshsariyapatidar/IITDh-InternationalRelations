import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import {
  createFacultySchema,
  updateFacultySchema,
  facultyIdSchema,
  listFacultySchema,
} from "./faculty.schema.js";
import * as ctrl from "./faculty.controller.js";

const router: Router = Router();

router.get("/", validate({ query: listFacultySchema }), ctrl.listFaculty);
router.get("/:id", validate({ params: facultyIdSchema }), ctrl.getFaculty);
router.post(
  "/",
  authenticate,
  validate({ body: createFacultySchema }),
  ctrl.createFacultyMember,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: facultyIdSchema, body: updateFacultySchema }),
  ctrl.updateFacultyMember,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: facultyIdSchema }),
  ctrl.deleteFacultyMember,
);

export default router;
