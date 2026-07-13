import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  siteContentKeySchema,
  updateSiteContentSchema,
  bulkUpdateSiteContentSchema,
  listSiteContentSchema,
} from "./site-content.schema.js";
import * as ctrl from "./site-content.controller.js";

const router: Router = Router();

router.get("/", cacheControl(60), validate({ query: listSiteContentSchema }), ctrl.listSiteContent);

// "/bulk" must be registered before "/:key" — Express matches in registration order.
router.patch("/bulk", authenticate, validate({ body: bulkUpdateSiteContentSchema }), ctrl.bulkUpdateSiteContent);

router.get("/:key", cacheControl(60), validate({ params: siteContentKeySchema }), ctrl.getSiteContent);
router.patch(
  "/:key",
  authenticate,
  validate({ params: siteContentKeySchema, body: updateSiteContentSchema }),
  ctrl.updateSiteContent,
);

export default router;
