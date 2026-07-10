import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  announcementIdSchema,
  listAnnouncementsSchema,
} from "./announcement.schema.js";
import * as ctrl from "./announcement.controller.js";

const router: Router = Router();

// Public
router.get(
  "/",
  validate({ query: listAnnouncementsSchema }),
  ctrl.listAnnouncements,
);
router.get(
  "/:id",
  validate({ params: announcementIdSchema }),
  ctrl.getAnnouncement,
);

// Protected
router.post(
  "/",
  authenticate,
  validate({ body: createAnnouncementSchema }),
  ctrl.createAnnouncement,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: announcementIdSchema, body: updateAnnouncementSchema }),
  ctrl.updateAnnouncement,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: announcementIdSchema }),
  ctrl.deleteAnnouncement,
);

export default router;
