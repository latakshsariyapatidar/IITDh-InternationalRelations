import { Router } from "express";
import validate from "../../shared/middleware/validate.js";
import authenticate from "../../shared/middleware/authenticate.js";
import { createTestimonialSchema, updateTestimonialSchema, testimonialIdSchema, listTestimonialsSchema } from "./testimonial.schema.js";
import * as ctrl from "./testimonial.controller.js";

const router: Router = Router();

router.get("/", validate({ query: listTestimonialsSchema }), ctrl.listTestimonials);
router.get("/:id", validate({ params: testimonialIdSchema }), ctrl.getTestimonial);
router.post("/", authenticate, validate({ body: createTestimonialSchema }), ctrl.createTestimonial);
router.patch("/:id", authenticate, validate({ params: testimonialIdSchema, body: updateTestimonialSchema }), ctrl.updateTestimonial);
router.delete("/:id", authenticate, validate({ params: testimonialIdSchema }), ctrl.deleteTestimonial);

export default router;
