import { z } from "zod";

export const createFacultySchema = z.object({
  name: z.string().trim().min(1).max(200),
  redirectUrl: z.string().trim().url("Must be a valid URL").max(500),
  isActive: z.boolean().default(true),
});

export const updateFacultySchema = createFacultySchema.partial();
export const facultyIdSchema = z.object({ id: z.string().uuid() });
export const listFacultySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
export type ListFacultyQuery = z.infer<typeof listFacultySchema>;
