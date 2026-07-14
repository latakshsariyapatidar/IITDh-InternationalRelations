import { z } from "zod";

export const createFAQSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateFAQSchema = createFAQSchema.partial();
export const faqIdSchema = z.object({ id: z.string().uuid() });
export const listFAQsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateFAQInput = z.infer<typeof createFAQSchema>;
export type UpdateFAQInput = z.infer<typeof updateFAQSchema>;
export type ListFAQsQuery = z.infer<typeof listFAQsSchema>;
