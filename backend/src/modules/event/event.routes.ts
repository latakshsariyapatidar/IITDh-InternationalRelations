import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createEventSchema,
  updateEventSchema,
  eventIdSchema,
  listEventsSchema,
} from "./event.schema.js";
import * as ctrl from "./event.controller.js";

const router: Router = Router();

router.get("/", cacheControl(30), validate({ query: listEventsSchema }), ctrl.listEvents);
router.get("/:id", cacheControl(30), validate({ params: eventIdSchema }), ctrl.getEvent);
router.post(
  "/",
  authenticate,
  validate({ body: createEventSchema }),
  ctrl.createEvent,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: eventIdSchema, body: updateEventSchema }),
  ctrl.updateEvent,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: eventIdSchema }),
  ctrl.deleteEvent,
);

export default router;
