import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import { listNotificationsSchema, notificationIdSchema } from "./notification.schema.js";
import * as ctrl from "./notification.controller.js";

const router: Router = Router();

// Admin-only throughout — these track expiring visas and MOUs.
router.get("/", authenticate, validate({ query: listNotificationsSchema }), ctrl.listNotifications);

// Both registered before "/:id" so they are not read as notification ids.
router.get("/unread-count", authenticate, ctrl.getUnreadCount);
router.post("/scan", authenticate, ctrl.scanNotifications);
router.post("/read-all", authenticate, ctrl.markAllNotificationsRead);

router.patch(
  "/:id/read",
  authenticate,
  validate({ params: notificationIdSchema }),
  ctrl.markNotificationRead,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: notificationIdSchema }),
  ctrl.deleteNotification,
);

export default router;
