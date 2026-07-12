import { z } from "zod";

const GalleryCategory = z.enum([
  "CAMPUS",
  "EVENTS",
  "STUDENT_LIFE",
  "COLLABORATIONS",
  "OTHER",
]);

export const createGalleryImageSchema = z.object({
  title: z.string().trim().min(1).max(200),
  imageUrl: z.string().url("Must be a valid URL").max(500),
  caption: z.string().trim().max(300).optional(),
  category: GalleryCategory.default("OTHER"),
  takenAt: z.coerce.date().optional(),
  isPublic: z.boolean().default(true),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();
export const galleryIdSchema = z.object({ id: z.string().uuid() });
export const listGallerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: GalleryCategory.optional(),
  isPublic: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type ListGalleryQuery = z.infer<typeof listGallerySchema>;
