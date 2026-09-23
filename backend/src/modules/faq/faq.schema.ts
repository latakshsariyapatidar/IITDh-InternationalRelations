import { z } from "zod";
import { partialForUpdate, queryBoolean } from "../../shared/utils/zodHelpers.js";

export const createFAQSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateFAQSchema = partialForUpdate(createFAQSchema);
export const faqIdSchema = z.object({ id: z.string().uuid() });
export const listFAQsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  isActive: queryBoolean(),
});

export type CreateFAQInput = z.infer<typeof createFAQSchema>;
export type UpdateFAQInput = z.infer<typeof updateFAQSchema>;
export type ListFAQsQuery = z.infer<typeof listFAQsSchema>;
