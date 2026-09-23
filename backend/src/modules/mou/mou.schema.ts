import { z } from "zod";
import {
  calendarDate,
  clearableCalendarDate,
  partialForUpdate,
  queryBoolean,
} from "../../shared/utils/zodHelpers.js";

const MouStatusEnum = z.enum(["ACTIVE", "EXPIRED", "RENEWED", "TERMINATED"]);

// `documentPath` is deliberately absent: it is set only by uploading a file
// through POST /:id/document, so a request body can never point the record at
// an arbitrary path on disk.
export const createMouSchema = z.object({
  partnerId: z.string().uuid("Invalid partner"),
  title: z.string().trim().min(1).max(300),
  signedDate: calendarDate(),
  expiryDate: clearableCalendarDate(),
  status: MouStatusEnum.default("ACTIVE"),
  scope: z.string().trim().optional(),
  isPublic: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateMouSchema = partialForUpdate(createMouSchema);
export const mouIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export const listMousSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  partnerId: z.string().uuid().optional(),
  status: MouStatusEnum.optional(),
  expiringWithinDays: z.coerce.number().int().positive().optional(),
  isPublic: queryBoolean(),
});

export type CreateMouInput = z.infer<typeof createMouSchema>;
export type UpdateMouInput = z.infer<typeof updateMouSchema>;
export type ListMousQuery = z.infer<typeof listMousSchema>;
