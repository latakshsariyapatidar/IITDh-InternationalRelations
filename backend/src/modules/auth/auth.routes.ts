import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import { loginSchema } from "./auth.schema.js";
import {
  loginController,
  refreshController,
  logoutController,
  logoutAllController,
} from "./auth.controller.js";

const router: Router = Router();

router.post("/login", validate({ body: loginSchema }), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.post("/logout-all", authenticate, logoutAllController);

export default router;
