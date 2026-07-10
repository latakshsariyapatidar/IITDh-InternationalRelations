import { z } from "zod";

export const createFacultySchema = z.object({
  name: z.string().trim().min(1).max(200),
  designation: z.string().trim().max(200).optional(),
  department: z.string().trim().min(1).max(200),
  email: z.string().email("Invalid email").max(255),
  bio: z.string().trim().optional(),
  photoUrl: z.string().url().max(500).optional(),
  isActive: z.boolean().default(true),
  redirectUrl: z.string().url().max(500),
});

export const updateFacultySchema = createFacultySchema.partial();
export const facultyIdSchema = z.object({ id: z.string().uuid() });
export const listFacultySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  department: z.string().trim().optional(),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
export type ListFacultyQuery = z.infer<typeof listFacultySchema>;
