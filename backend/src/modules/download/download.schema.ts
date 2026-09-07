import { z } from "zod";

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
  fileUrl: z.string().regex(/^(https?:\/\/|\/)/, "Must be a valid URL or path").max(500),
  fileType: z.string().trim().max(50).optional(),
  category: DownloadCategory.default("OTHER"),
  isPublic: z.boolean().default(true),
});

export const updateDownloadSchema = createDownloadSchema.partial();
export const downloadIdSchema = z.object({ id: z.string().uuid() });
export const listDownloadsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: DownloadCategory.optional(),
  isPublic: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateDownloadInput = z.infer<typeof createDownloadSchema>;
export type UpdateDownloadInput = z.infer<typeof updateDownloadSchema>;
export type ListDownloadsQuery = z.infer<typeof listDownloadsSchema>;
