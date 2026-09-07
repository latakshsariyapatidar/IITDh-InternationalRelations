import { z } from "zod";

const MouStatusEnum = z.enum(["ACTIVE", "EXPIRED", "RENEWED", "TERMINATED"]);

// `documentPath` is deliberately absent: it is set only by uploading a file
// through POST /:id/document, so a request body can never point the record at
// an arbitrary path on disk.
export const createMouSchema = z.object({
  partnerId: z.string().uuid("Invalid partner"),
  title: z.string().trim().min(1).max(300),
  signedDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
  status: MouStatusEnum.default("ACTIVE"),
  scope: z.string().trim().optional(),
  isPublic: z.boolean().default(true),
});

export const updateMouSchema = createMouSchema.partial();
export const mouIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export const listMousSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  partnerId: z.string().uuid().optional(),
  status: MouStatusEnum.optional(),
  expiringWithinDays: z.coerce.number().int().positive().optional(),
  isPublic: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateMouInput = z.infer<typeof createMouSchema>;
export type UpdateMouInput = z.infer<typeof updateMouSchema>;
export type ListMousQuery = z.infer<typeof listMousSchema>;
