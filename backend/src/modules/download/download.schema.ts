import { z } from "zod";
import { httpUrlOrPath, partialForUpdate, queryBoolean } from "../../shared/utils/zodHelpers.js";

const DownloadCategory = z.enum([
  "ADMISSION_FORM",
  "VISA_GUIDE",
  "MOU_DOCUMENT",
  "BROCHURE",
  "OTHER",
]);

export const createDownloadSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional(),
  // httpUrlOrPath, not a regex. The old check was /^(https?:\/\/|\/)/, which
  // accepts "//evil.example/x": the alternation's bare "/" matches the first
  // slash, and a browser reads a leading "//" as a protocol-relative absolute
  // URL. A logo or image src could therefore be pointed off-site while looking
  // like a local upload path.
  fileUrl: httpUrlOrPath(),
  fileType: z.string().trim().max(50).optional(),
  category: DownloadCategory.default("OTHER"),
  isPublic: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateDownloadSchema = partialForUpdate(createDownloadSchema);
export const downloadIdSchema = z.object({ id: z.string().uuid() });
export const listDownloadsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: DownloadCategory.optional(),
  isPublic: queryBoolean(),
});

export type CreateDownloadInput = z.infer<typeof createDownloadSchema>;
export type UpdateDownloadInput = z.infer<typeof updateDownloadSchema>;
export type ListDownloadsQuery = z.infer<typeof listDownloadsSchema>;
