import { Router } from "express";
import { z } from "zod";
import validate from "../../shared/middleware/validate.js";
import cacheControl from "../../shared/middleware/cache.js";
import { PAGE_KEYS } from "./page.constants.js";
import { getPage } from "./page.controller.js";

const router: Router = Router();

const pageParamSchema = z.object({ page: z.enum(PAGE_KEYS) });

router.get("/:page", cacheControl(60), validate({ params: pageParamSchema }), getPage);

export default router;
