import { z } from "zod";

export const createFacultySchema = z.object({
  name: z.string().trim().min(1).max(200),
  redirectUrl: z.string().trim().url("Must be a valid URL").max(500),
  // Doubles as the faculty-portal allowlist: a Google sign-in with this
  // address gets a faculty token instead of a student one. Must be an
  // institute address, since sign-in is restricted to that domain anyway.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Must be a valid email")
    .max(255)
    .refine((value) => value.endsWith("@iitdh.ac.in"), {
      message: "Faculty portal access requires an @iitdh.ac.in address",
    })
    .optional(),
  isPortalEnabled: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export const updateFacultySchema = createFacultySchema.partial().extend({
  // Explicit null revokes portal access without deleting the directory entry.
  email: createFacultySchema.shape.email.nullable().optional(),
});

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
