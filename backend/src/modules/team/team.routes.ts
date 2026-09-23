import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamIdSchema,
  listTeamSchema,
} from "./team.schema.js";
import * as ctrl from "./team.controller.js";

const router: Router = Router();

// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(300), validate({ query: listTeamSchema }), ctrl.listTeam);
router.get("/:id", optionalAuthenticate, cacheControl(300), validate({ params: teamIdSchema }), ctrl.getTeamMember);
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
