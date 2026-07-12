import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import {
  createPartnerSchema,
  updatePartnerSchema,
  partnerIdSchema,
  listPartnersSchema,
} from "./partner.schema.js";
import * as ctrl from "./partner.controller.js";

const router: Router = Router();

router.get("/", validate({ query: listPartnersSchema }), ctrl.listPartners);
router.get("/:id", validate({ params: partnerIdSchema }), ctrl.getPartner);
router.post(
  "/",
  authenticate,
  validate({ body: createPartnerSchema }),
  ctrl.createPartner,
);
router.patch(
  "/:id",
  authenticate,
  validate({ params: partnerIdSchema, body: updatePartnerSchema }),
  ctrl.updatePartner,
);
router.delete(
  "/:id",
  authenticate,
  validate({ params: partnerIdSchema }),
  ctrl.deletePartner,
);

export default router;
