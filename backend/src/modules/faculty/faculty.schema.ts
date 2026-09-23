import { z } from "zod";
import { httpUrl, normaliseUrlInput, partialForUpdate, queryBoolean } from "../../shared/utils/zodHelpers.js";

export const createFacultySchema = z.object({
  name: z.string().trim().min(1).max(200),
  // httpUrl restricts the scheme to http(s). z.string().url() accepts
  // "javascript:" and "data:", and this value is followed as a link.
  redirectUrl: z.preprocess(normaliseUrlInput, httpUrl()),
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

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateFacultySchema = partialForUpdate(createFacultySchema).extend({
  // Explicit null revokes portal access without deleting the directory entry.
  email: createFacultySchema.shape.email.nullable().optional(),
});

export const facultyIdSchema = z.object({ id: z.string().uuid() });
export const listFacultySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  isActive: queryBoolean(),
});

export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
export type ListFacultyQuery = z.infer<typeof listFacultySchema>;
