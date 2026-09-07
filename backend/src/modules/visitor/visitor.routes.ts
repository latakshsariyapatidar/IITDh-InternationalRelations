import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import { visitorSubmitLimiter } from "./visitor.rateLimit.js";
import {
  createVisitorSchema,
  updateVisitorSchema,
  visitorIdSchema,
  listVisitorsSchema,
  exportVisitorsSchema,
} from "./visitor.schema.js";
import * as ctrl from "./visitor.controller.js";

const router: Router = Router();

// Public — any visiting delegate can register their own details, no sign-in.
router.post(
  "/",
  visitorSubmitLimiter,
  validate({ body: createVisitorSchema }),
  ctrl.createVisitor,
);

// Admin-only: the stored records carry personal contact and passport details,
// so nothing below is public.
router.get("/", authenticate, validate({ query: listVisitorsSchema }), ctrl.listVisitors);

// Registered before "/:id" so "export" is not read as a visitor id.
router.get(
  "/export",
  authenticate,
  validate({ query: exportVisitorsSchema }),
  ctrl.exportVisitors,
);

router.get("/:id", authenticate, validate({ params: visitorIdSchema }), ctrl.getVisitor);
router.patch(
  "/:id",
  authenticate,
  validate({ params: visitorIdSchema, body: updateVisitorSchema }),
  ctrl.updateVisitor,
);
router.delete("/:id", authenticate, validate({ params: visitorIdSchema }), ctrl.deleteVisitor);

export default router;
