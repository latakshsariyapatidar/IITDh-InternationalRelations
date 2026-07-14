import { z } from "zod";

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(100),
  year: z.string().trim().min(1).max(50),
  photoUrl: z.string().regex(/^(https?:\/\/|\/)/, "Must be a valid URL or path").max(500).optional(),
  isActive: z.boolean().default(true),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();
export const teamIdSchema = z.object({ id: z.string().uuid() });
export const listTeamSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
export type ListTeamQuery = z.infer<typeof listTeamSchema>;
