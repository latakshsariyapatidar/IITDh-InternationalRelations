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

// There is deliberately NO public read route on this module.
//
// The visitor form is a data-collection form for the office: a delegate
// submits their own contact details, passport number and travel dates so the
// IRO has a record of who is on campus. It is not website content, and it does
// not become website content by being approved — approval only means the
// office has checked the record.
//
// The public Visits page is a separate thing entirely: events and conferences
// the office publishes itself. It is built from the events module.
//
// So everything below requires a sign-in.
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
