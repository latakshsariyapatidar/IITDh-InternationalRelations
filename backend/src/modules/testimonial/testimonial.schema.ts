import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(100),
  program: z.string().trim().min(1).max(200),
  text: z.string().trim().min(1),
  photoUrl: z.string().regex(/^(https?:\/\/|\/)/, "Must be a valid URL or path").max(500).optional(),
  isActive: z.boolean().default(true),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
export const testimonialIdSchema = z.object({ id: z.string().uuid() });
export const listTestimonialsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type ListTestimonialsQuery = z.infer<typeof listTestimonialsSchema>;
