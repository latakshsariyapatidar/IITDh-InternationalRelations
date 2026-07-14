import { z } from "zod";

const ProgramLevel = z.enum(["UNDERGRADUATE", "POSTGRADUATE", "PHD"]);

export const createProgramSchema = z.object({
  name: z.string().trim().min(1).max(200),
  level: ProgramLevel,
  redirectUrl: z.string().trim().url("Must be a valid URL").max(500),
  isActive: z.boolean().default(true),
});

export const updateProgramSchema = createProgramSchema.partial();
export const programIdSchema = z.object({ id: z.string().uuid() });
export const listProgramsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  level: ProgramLevel.optional(),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type ListProgramsQuery = z.infer<typeof listProgramsSchema>;
