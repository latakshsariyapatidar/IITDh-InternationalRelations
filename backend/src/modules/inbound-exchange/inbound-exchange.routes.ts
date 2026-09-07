import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import { allowAdminOrSignedLink } from "../inbound-shared/inbound-documents.js";
import { exchangeSubmitLimiter } from "./inbound-exchange.rateLimit.js";
import { exchangeDocumentUpload } from "./inbound-exchange.storage.js";
import {
  createExchangeApplicationSchema,
  updateExchangeApplicationStatusSchema,
  updateExchangeApplicationRecordSchema,
  exchangeApplicationIdSchema,
  exchangeDocumentFieldParamSchema,
  listExchangeApplicationsSchema,
  exportExchangeApplicationsSchema,
} from "./inbound-exchange.schema.js";
import * as ctrl from "./inbound-exchange.controller.js";

const router: Router = Router();

// Public — an incoming exchange or internship student applies directly. This is
// a separate register from degree admission (/api/v1/applications): different
// form, different review queue, different sheet in the office's database.
router.post(
  "/",
  exchangeSubmitLimiter,
  exchangeDocumentUpload,
  validate({ body: createExchangeApplicationSchema }),
  ctrl.createExchangeApplication,
);

// Admin-only.
router.get(
  "/",
  authenticate,
  validate({ query: listExchangeApplicationsSchema }),
  ctrl.listExchangeApplications,
);

// Registered before "/:id" so "export" is not read as an application id.
router.get(
  "/export",
  authenticate,
  validate({ query: exportExchangeApplicationsSchema }),
  ctrl.exportExchangeApplications,
);

router.get(
  "/:id",
  authenticate,
  validate({ params: exchangeApplicationIdSchema }),
  ctrl.getExchangeApplication,
);
router.patch(
  "/:id",
  authenticate,
  validate({
    params: exchangeApplicationIdSchema,
    body: updateExchangeApplicationStatusSchema,
  }),
  ctrl.updateExchangeApplicationStatus,
);
// Office record — visa dates, roll number, faculty advisor and the rest of the
// columns the IRO maintains after submission.
router.patch(
  "/:id/record",
  authenticate,
  validate({
    params: exchangeApplicationIdSchema,
    body: updateExchangeApplicationRecordSchema,
  }),
  ctrl.updateExchangeApplicationRecord,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: exchangeApplicationIdSchema }),
  ctrl.deleteExchangeApplication,
);

// Admin bearer token, or a signed link clicked out of an exported spreadsheet.
router.get(
  "/:id/documents/:field",
  optionalAuthenticate,
  validate({ params: exchangeDocumentFieldParamSchema }),
  allowAdminOrSignedLink("inbound-exchange"),
  ctrl.downloadExchangeDocument,
);

export default router;
