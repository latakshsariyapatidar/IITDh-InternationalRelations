import { Router } from "express";
import authenticate from "../../shared/middleware/authenticate.js";
import { getStats } from "./stats.controller.js";

const router: Router = Router();
router.get("/", authenticate, getStats);
export default router;
