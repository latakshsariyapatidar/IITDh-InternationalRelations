import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  content: z.string().trim().min(1, "Content is required"),
  isPublic: z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
});

export const updateAnnouncementSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  content: z.string().trim().min(1).optional(),
  isPublic: z.boolean().optional(),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const announcementIdSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

export const listAnnouncementsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  isPublic: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
export type ListAnnouncementsQuery = z.infer<typeof listAnnouncementsSchema>;
