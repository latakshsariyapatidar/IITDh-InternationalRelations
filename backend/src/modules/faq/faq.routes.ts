import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createFAQSchema,
  updateFAQSchema,
  faqIdSchema,
  listFAQsSchema,
} from "./faq.schema.js";
import * as ctrl from "./faq.controller.js";

const router: Router = Router();

// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(300), validate({ query: listFAQsSchema }), ctrl.listFAQs);
router.get("/:id", optionalAuthenticate, cacheControl(300), validate({ params: faqIdSchema }), ctrl.getFAQ);
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
