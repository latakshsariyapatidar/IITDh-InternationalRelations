import { z } from "zod";
import { httpUrlOrPath, partialForUpdate, queryBoolean } from "../../shared/utils/zodHelpers.js";

const GalleryCategory = z.enum([
  "CAMPUS",
  "EVENTS",
  "STUDENT_LIFE",
  "COLLABORATIONS",
  "OTHER",
]);

export const createGalleryImageSchema = z.object({
  title: z.string().trim().min(1).max(200),
  // httpUrlOrPath, not a regex. The old check was /^(https?:\/\/|\/)/, which
  // accepts "//evil.example/x": the alternation's bare "/" matches the first
  // slash, and a browser reads a leading "//" as a protocol-relative absolute
  // URL. A logo or image src could therefore be pointed off-site while looking
  // like a local upload path.
  imageUrl: httpUrlOrPath(),
  caption: z.string().trim().max(300).optional(),
  category: GalleryCategory.default("OTHER"),
  takenAt: z.coerce.date().optional(),
  isPublic: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateGalleryImageSchema = partialForUpdate(createGalleryImageSchema);
export const galleryIdSchema = z.object({ id: z.string().uuid() });
export const listGallerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: GalleryCategory.optional(),
  isPublic: queryBoolean(),
});

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type ListGalleryQuery = z.infer<typeof listGallerySchema>;
