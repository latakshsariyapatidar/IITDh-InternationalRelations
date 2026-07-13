import { z } from "zod";

export const siteContentKeySchema = z.object({
  key: z.string().trim().min(1),
});

export const updateSiteContentSchema = z.object({
  value: z.string(),
});

export const bulkUpdateSiteContentSchema = z.object({
  updates: z
    .array(z.object({ key: z.string().trim().min(1), value: z.string() }))
    .min(1, "At least one update is required"),
});

export const listSiteContentSchema = z.object({
  page: z.string().trim().optional(),
});

export type UpdateSiteContentInput = z.infer<typeof updateSiteContentSchema>;
export type BulkUpdateSiteContentInput = z.infer<typeof bulkUpdateSiteContentSchema>;
export type ListSiteContentQuery = z.infer<typeof listSiteContentSchema>;
