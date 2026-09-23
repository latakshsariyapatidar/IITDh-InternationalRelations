import { z } from "zod";
import { sanitizeRichText } from "../../shared/utils/sanitizeRichText.js";
import {
  clearableHttpUrlOrPath,
  httpUrlOrPath,
  partialForUpdate,
  queryBoolean,
} from "../../shared/utils/zodHelpers.js";

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(100),
  year: z.string().trim().min(1).max(50),
  // httpUrlOrPath, not a regex. The old check was /^(https?:\/\/|\/)/, which
  // accepts "//evil.example/x": the alternation's bare "/" matches the first
  // slash, and a browser reads a leading "//" as a protocol-relative absolute
  // URL. A logo or image src could therefore be pointed off-site while looking
  // like a local upload path.
  photoUrl: clearableHttpUrlOrPath(),
  email: z.string().email("Invalid email format").max(255).optional().or(z.literal("")),
  // Quill HTML, rendered on the public About page with
  // dangerouslySetInnerHTML. Sanitised here, on write, so the database can
  // only ever hold markup that is safe to render — a frontend that forgets to
  // sanitise cannot reintroduce the hole, and the stored value is cleaned the
  // next time an admin saves the row.
  //
  // The length cap runs first so a huge payload is rejected rather than
  // sanitised, and again afterwards because the policy only ever shrinks.
  responsibilities: z
    .string()
    .max(2000)
    .transform(sanitizeRichText)
    .pipe(z.string().max(2000))
    .optional(),
  isActive: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateTeamMemberSchema = partialForUpdate(createTeamMemberSchema);
export const teamIdSchema = z.object({ id: z.string().uuid() });
export const listTeamSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  isActive: queryBoolean(),
});

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
export type ListTeamQuery = z.infer<typeof listTeamSchema>;
