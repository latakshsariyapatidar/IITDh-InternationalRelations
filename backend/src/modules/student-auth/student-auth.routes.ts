import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import { googleLoginSchema } from "./student-auth.schema.js";
import {
  googleSignInLimiter,
  campusRefreshLimiter,
} from "./student-auth.rateLimit.js";
import { googleLoginController, refreshController, logoutController } from "./student-auth.controller.js";

const router: Router = Router();

router.post(
  "/google",
  googleSignInLimiter,
  validate({ body: googleLoginSchema }),
  googleLoginController,
);
router.post("/refresh", campusRefreshLimiter, refreshController);
router.post("/logout", logoutController);

export default router;
