import { Router } from "express";
import { z } from "zod";
import validate from "../../shared/middleware/validate.js";
import authenticateFaculty from "../../shared/middleware/authenticateFaculty.js";
import * as ctrl from "./faculty-portal.controller.js";

const router: Router = Router();

const facultyFeedSchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

// Faculty counterpart to the student portal. Every route requires a campus
// token whose email is listed in the faculty directory.
router.get("/me", authenticateFaculty, ctrl.getFacultyProfile);
router.get(
  "/opportunities",
  authenticateFaculty,
  validate({ query: facultyFeedSchema }),
  ctrl.getFacultyOpportunities,
);

export default router;
