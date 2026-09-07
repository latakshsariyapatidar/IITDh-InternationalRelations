import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  announcementIdSchema,
  listAnnouncementsSchema,
} from "./announcement.schema.js";
import * as ctrl from "./announcement.controller.js";

const router: Router = Router();

// Public — an admin bearer token additionally reveals scheduled and expired
// announcements for the admin panel.
router.get(
  "/",
  optionalAuthenticate,
  cacheControl(30),
  validate({ query: listAnnouncementsSchema }),
  ctrl.listAnnouncements,
);
router.get(
  "/:id",
  optionalAuthenticate,
  cacheControl(30),
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
