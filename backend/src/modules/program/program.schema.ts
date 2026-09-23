import { z } from "zod";
import { httpUrl, normaliseUrlInput, partialForUpdate, queryBoolean } from "../../shared/utils/zodHelpers.js";

const ProgramLevel = z.enum(["UNDERGRADUATE", "POSTGRADUATE", "PHD"]);

export const createProgramSchema = z.object({
  name: z.string().trim().min(1).max(200),
  level: ProgramLevel,
  // httpUrl restricts the scheme to http(s). z.string().url() accepts
  // "javascript:" and "data:", and this value is followed as a link.
  redirectUrl: z.preprocess(normaliseUrlInput, httpUrl()),
  isActive: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateProgramSchema = partialForUpdate(createProgramSchema);
export const programIdSchema = z.object({ id: z.string().uuid() });
export const listProgramsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  level: ProgramLevel.optional(),
  isActive: queryBoolean(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ListProgramsQuery = z.infer<typeof listProgramsSchema>;
