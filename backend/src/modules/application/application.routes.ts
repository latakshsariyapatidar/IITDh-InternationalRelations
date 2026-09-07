import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import { allowAdminOrSignedLink } from "../inbound-shared/inbound-documents.js";
import { applicationSubmitLimiter } from "./application.rateLimit.js";
import { applicationDocumentUpload } from "./application.storage.js";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
  updateApplicationRecordSchema,
  applicationIdSchema,
  documentFieldParamSchema,
  listApplicationsSchema,
  exportApplicationsSchema,
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

// Registered before "/:id" so "export" is not read as an application id.
router.get(
  "/export",
  authenticate,
  validate({ query: exportApplicationsSchema }),
  ctrl.exportApplications,
);

router.get("/:id", authenticate, validate({ params: applicationIdSchema }), ctrl.getApplication);
router.patch(
  "/:id",
  authenticate,
  validate({ params: applicationIdSchema, body: updateApplicationStatusSchema }),
  ctrl.updateApplicationStatus,
);
// Office record — visa dates, roll number, faculty advisor and the rest of the
// columns the IRO maintains after submission.
router.patch(
  "/:id/record",
  authenticate,
  validate({ params: applicationIdSchema, body: updateApplicationRecordSchema }),
  ctrl.updateApplicationRecord,
);
router.delete("/:id", authenticate, validate({ params: applicationIdSchema }), ctrl.deleteApplication);

// Serves both an admin bearer token and a signed link clicked out of an
// exported spreadsheet — see inbound-shared/inbound-documents.ts.
router.get(
  "/:id/documents/:field",
  optionalAuthenticate,
  validate({ params: documentFieldParamSchema }),
  allowAdminOrSignedLink("applications"),
  ctrl.downloadApplicationDocument,
);

export default router;
