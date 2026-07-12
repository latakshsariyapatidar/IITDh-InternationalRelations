import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamIdSchema,
  listTeamSchema,
} from "./team.schema.js";
import * as ctrl from "./team.controller.js";

const router: Router = Router();

router.get("/", validate({ query: listTeamSchema }), ctrl.listTeam);
router.get("/:id", validate({ params: teamIdSchema }), ctrl.getTeamMember);
router.post(
  "/",
  authenticate,
  validate({ body: createTeamMemberSchema }),
  ctrl.createTeamMember,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: teamIdSchema, body: updateTeamMemberSchema }),
  ctrl.updateTeamMember,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: teamIdSchema }),
  ctrl.deleteTeamMember,
);

export default router;
