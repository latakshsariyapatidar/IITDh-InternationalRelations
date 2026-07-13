import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamIdSchema,
  listTeamSchema,
} from "./team.schema.js";
import * as ctrl from "./team.controller.js";

const router: Router = Router();

router.get("/", cacheControl(300), validate({ query: listTeamSchema }), ctrl.listTeam);
router.get("/:id", cacheControl(300), validate({ params: teamIdSchema }), ctrl.getTeamMember);
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
