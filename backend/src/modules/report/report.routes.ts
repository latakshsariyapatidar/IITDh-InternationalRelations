import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import { inboundReportSchema, visitorReportSchema } from "./report.schema.js";
import * as ctrl from "./report.controller.js";

const router: Router = Router();

// Admin-only. `format=json` drives the on-screen table, `format=xlsx` returns
// the office's own spreadsheet layout for the same date range.
router.get(
  "/inbound",
  authenticate,
  validate({ query: inboundReportSchema }),
  ctrl.getInboundReport,
);
router.get(
  "/visitors",
  authenticate,
  validate({ query: visitorReportSchema }),
  ctrl.getVisitorReport,
);

export default router;
