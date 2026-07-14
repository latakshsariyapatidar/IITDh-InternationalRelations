import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import { applicationSubmitLimiter } from "./application.rateLimit.js";
import { applicationDocumentUpload } from "./application.storage.js";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  applicationIdSchema,
  documentFieldParamSchema,
  listApplicationsSchema,
} from "./application.schema.js";
import * as ctrl from "./application.controller.js";

const router: Router = Router();

// Public — a foreign national applicant submits their own application.
router.post(
  "/",
  applicationSubmitLimiter,
  applicationDocumentUpload,
  validate({ body: createApplicationSchema }),
  ctrl.createApplication,
);

// Admin-only.
router.get("/", authenticate, validate({ query: listApplicationsSchema }), ctrl.listApplications);
router.get("/:id", authenticate, validate({ params: applicationIdSchema }), ctrl.getApplication);
router.patch(
  "/:id",
  authenticate,
  validate({ params: applicationIdSchema, body: updateApplicationStatusSchema }),
  ctrl.updateApplicationStatus,
);
router.delete("/:id", authenticate, validate({ params: applicationIdSchema }), ctrl.deleteApplication);
router.get(
  "/:id/documents/:field",
  authenticate,
  validate({ params: documentFieldParamSchema }),
  ctrl.downloadApplicationDocument,
);

export default router;
