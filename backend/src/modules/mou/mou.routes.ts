import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import { createMouSchema, updateMouSchema, mouIdSchema, listMousSchema } from "./mou.schema.js";
import * as ctrl from "./mou.controller.js";

const router: Router = Router();

router.get("/", cacheControl(300), validate({ query: listMousSchema }), ctrl.listMous);
router.get("/:id", cacheControl(300), validate({ params: mouIdSchema }), ctrl.getMou);
router.post("/", authenticate, validate({ body: createMouSchema }), ctrl.createMou);
router.patch("/:id", authenticate, validate({ params: mouIdSchema, body: updateMouSchema }), ctrl.updateMou);
router.delete("/:id", authenticate, validate({ params: mouIdSchema }), ctrl.deleteMou);

export default router;
