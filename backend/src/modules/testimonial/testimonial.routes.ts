import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import optionalAuthenticate from "../../shared/middleware/optionalAuthenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import { createTestimonialSchema, updateTestimonialSchema, testimonialIdSchema, listTestimonialsSchema } from "./testimonial.schema.js";
import * as ctrl from "./testimonial.controller.js";

const router: Router = Router();

// Public listings. `optionalAuthenticate` never rejects: it sets `req.user`
// when a valid admin token is present and continues anonymously otherwise, so
// one route serves both the public site (live rows only) and the admin panel
// (everything). The visibility flag is enforced in the repository, not here.
router.get("/", optionalAuthenticate, cacheControl(300), validate({ query: listTestimonialsSchema }), ctrl.listTestimonials);
router.get("/:id", optionalAuthenticate, cacheControl(300), validate({ params: testimonialIdSchema }), ctrl.getTestimonial);
router.post("/", authenticate, validate({ body: createTestimonialSchema }), ctrl.createTestimonial);
router.patch("/:id", authenticate, validate({ params: testimonialIdSchema, body: updateTestimonialSchema }), ctrl.updateTestimonial);
router.delete("/:id", authenticate, validate({ params: testimonialIdSchema }), ctrl.deleteTestimonial);

export default router;
