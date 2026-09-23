import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createEventSchema,
  updateEventSchema,
  eventIdSchema,
  listEventsSchema,
} from "./event.schema.js";
import * as ctrl from "./event.controller.js";

const router: Router = Router();

// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(30), validate({ query: listEventsSchema }), ctrl.listEvents);
router.get("/:id", optionalAuthenticate, cacheControl(30), validate({ params: eventIdSchema }), ctrl.getEvent);
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
