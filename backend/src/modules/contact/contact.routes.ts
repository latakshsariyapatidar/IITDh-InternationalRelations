import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createContactSchema,
  updateContactSchema,
  contactIdSchema,
  listContactsSchema,
} from "./contact.schema.js";
import * as ctrl from "./contact.controller.js";

const router: Router = Router();

router.get("/", cacheControl(300), validate({ query: listContactsSchema }), ctrl.listContacts);
router.get("/:id", cacheControl(300), validate({ params: contactIdSchema }), ctrl.getContact);
router.post(
  "/",
  authenticate,
  validate({ body: createContactSchema }),
  ctrl.createContact,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: contactIdSchema, body: updateContactSchema }),
  ctrl.updateContact,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: contactIdSchema }),
  ctrl.deleteContact,
);

export default router;
