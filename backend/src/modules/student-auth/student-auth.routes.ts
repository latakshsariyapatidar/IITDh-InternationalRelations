import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import { googleLoginSchema } from "./student-auth.schema.js";
import { googleLoginController, refreshController, logoutController } from "./student-auth.controller.js";
import { studentAuthLimiter } from "./student-auth.rateLimit.js";

const router: Router = Router();

router.post("/google", studentAuthLimiter, validate({ body: googleLoginSchema }), googleLoginController);
router.post("/refresh", studentAuthLimiter, refreshController);
router.post("/logout", logoutController);

export default router;
