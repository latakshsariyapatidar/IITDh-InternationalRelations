import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createFAQSchema,
  updateFAQSchema,
  faqIdSchema,
  listFAQsSchema,
} from "./faq.schema.js";
import * as ctrl from "./faq.controller.js";

const router: Router = Router();

router.get("/", cacheControl(300), validate({ query: listFAQsSchema }), ctrl.listFAQs);
router.get("/:id", cacheControl(300), validate({ params: faqIdSchema }), ctrl.getFAQ);
router.post(
  "/",
  authenticate,
  validate({ body: createFAQSchema }),
  ctrl.createFAQ,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: faqIdSchema, body: updateFAQSchema }),
  ctrl.updateFAQ,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: faqIdSchema }),
  ctrl.deleteFAQ,
);

export default router;
