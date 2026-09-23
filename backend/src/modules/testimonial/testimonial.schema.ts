import { z } from "zod";
import {
  clearableHttpUrlOrPath,
  httpUrlOrPath,
  partialForUpdate,
  queryBoolean,
} from "../../shared/utils/zodHelpers.js";

export const createTestimonialSchema = z.object({
  name: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(100),
  program: z.string().trim().min(1).max(200),
  text: z.string().trim().min(1),
  // httpUrlOrPath, not a regex. The old check was /^(https?:\/\/|\/)/, which
  // accepts "//evil.example/x": the alternation's bare "/" matches the first
  // slash, and a browser reads a leading "//" as a protocol-relative absolute
  // URL. A logo or image src could therefore be pointed off-site while looking
  // like a local upload path.
  photoUrl: clearableHttpUrlOrPath(),
  isActive: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateTestimonialSchema = partialForUpdate(createTestimonialSchema);
export const testimonialIdSchema = z.object({ id: z.string().uuid() });
export const listTestimonialsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  isActive: queryBoolean(),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type ListTestimonialsQuery = z.infer<typeof listTestimonialsSchema>;
