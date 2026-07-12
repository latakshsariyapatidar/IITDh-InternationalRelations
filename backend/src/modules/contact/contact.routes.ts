import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
  contactIdSchema,
  listContactsSchema,
} from "./contact.schema.js";
import * as ctrl from "./contact.controller.js";

const router: Router = Router();

router.get("/", validate({ query: listContactsSchema }), ctrl.listContacts);
router.get("/:id", validate({ params: contactIdSchema }), ctrl.getContact);
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
