import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import cacheControl from "../../shared/middleware/cache.js";
import { createTestimonialSchema, updateTestimonialSchema, testimonialIdSchema, listTestimonialsSchema } from "./testimonial.schema.js";
import * as ctrl from "./testimonial.controller.js";

const router: Router = Router();

router.get("/", cacheControl(300), validate({ query: listTestimonialsSchema }), ctrl.listTestimonials);
router.get("/:id", cacheControl(300), validate({ params: testimonialIdSchema }), ctrl.getTestimonial);
router.post("/", authenticate, validate({ body: createTestimonialSchema }), ctrl.createTestimonial);
router.patch("/:id", authenticate, validate({ params: testimonialIdSchema, body: updateTestimonialSchema }), ctrl.updateTestimonial);
router.delete("/:id", authenticate, validate({ params: testimonialIdSchema }), ctrl.deleteTestimonial);

export default router;
