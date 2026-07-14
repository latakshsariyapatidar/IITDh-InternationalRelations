import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import authenticateStudent from "../../shared/middleware/authenticateStudent.js";
import { outboundDocumentUpload } from "./outbound-application.storage.js";
import {
  createOutboundApplicationSchema,
  updateOutboundApplicationStatusSchema,
  outboundApplicationIdSchema,
  listOutboundApplicationsSchema,
} from "./outbound-application.schema.js";
import * as ctrl from "./outbound-application.controller.js";

const router: Router = Router();

// Student-only. "/mine" is registered before "/:id" for the same reason
// site-content.routes.ts registers "/bulk" before "/:key".
router.post(
  "/",
  authenticateStudent,
  outboundDocumentUpload,
  validate({ body: createOutboundApplicationSchema }),
  ctrl.createOutboundApplication,
);
router.get("/mine", authenticateStudent, ctrl.listMyOutboundApplications);

// Admin-only.
router.get("/", authenticate, validate({ query: listOutboundApplicationsSchema }), ctrl.listOutboundApplications);
router.get("/:id", authenticate, validate({ params: outboundApplicationIdSchema }), ctrl.getOutboundApplication);
router.patch(
  "/:id",
  authenticate,
  validate({ params: outboundApplicationIdSchema, body: updateOutboundApplicationStatusSchema }),
  ctrl.updateOutboundApplicationStatus,
);

export default router;
