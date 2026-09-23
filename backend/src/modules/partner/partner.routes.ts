import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import {
  createPartnerSchema,
  updatePartnerSchema,
  partnerIdSchema,
  listPartnersSchema,
} from "./partner.schema.js";
import * as ctrl from "./partner.controller.js";

const router: Router = Router();

// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(300), validate({ query: listPartnersSchema }), ctrl.listPartners);
router.get("/:id", optionalAuthenticate, cacheControl(300), validate({ params: partnerIdSchema }), ctrl.getPartner);
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
