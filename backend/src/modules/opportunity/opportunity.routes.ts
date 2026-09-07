import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import authenticateCampus from "../../shared/middleware/authenticateCampus.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createOpportunitySchema,
  updateOpportunitySchema,
  opportunityIdSchema,
  listOpportunitiesSchema,
  opportunityFeedSchema,
} from "./opportunity.schema.js";
import * as ctrl from "./opportunity.controller.js";

const router: Router = Router();

// Signed-in campus feed. Registered before "/:id" so "feed" is not read as an
// id, and kept uncached because the response depends on who is asking.
router.get(
  "/feed",
  authenticateCampus,
  validate({ query: opportunityFeedSchema }),
  ctrl.getOpportunityFeed,
);

// Public listings — an admin bearer token additionally reveals drafts and
// expired postings.
router.get(
  "/",
  optionalAuthenticate,
  cacheControl(30),
  validate({ query: listOpportunitiesSchema }),
  ctrl.listOpportunities,
);
router.get(
  "/:id",
  optionalAuthenticate,
  cacheControl(30),
  validate({ params: opportunityIdSchema }),
  ctrl.getOpportunity,
);

// Admin.
router.post("/", authenticate, validate({ body: createOpportunitySchema }), ctrl.createOpportunity);
router.patch(
  "/:id",
  authenticate,
  validate({ params: opportunityIdSchema, body: updateOpportunitySchema }),
  ctrl.updateOpportunity,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: opportunityIdSchema }),
  ctrl.deleteOpportunity,
);

export default router;
