import { z } from "zod";
import {
  clearableHttpUrlOrPath,
  httpUrlOrPath,
  partialForUpdate,
  queryBoolean,
} from "../../shared/utils/zodHelpers.js";

const EventType = z.enum([
  "VISIT",
  "CONFERENCE",
  "WORKSHOP",
  "EXCHANGE",
  "OTHER",
]);

export const createEventSchema = z.object({
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().optional(),
  startDate: z.coerce.date({
    message: "Start date is required and must be a valid date",
  }),
  endDate: z.coerce.date().optional(),
  location: z.string().trim().max(300).optional(),
  // httpUrlOrPath, not a regex. The old check was /^(https?:\/\/|\/)/, which
  // accepts "//evil.example/x": the alternation's bare "/" matches the first
  // slash, and a browser reads a leading "//" as a protocol-relative absolute
  // URL. A logo or image src could therefore be pointed off-site while looking
  // like a local upload path.
  imageUrl: clearableHttpUrlOrPath(),
  type: EventType.default("OTHER"),
  isPublic: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateEventSchema = partialForUpdate(createEventSchema);
export const eventIdSchema = z.object({ id: z.string().uuid() });
export const listEventsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  type: EventType.optional(),
  isPublic: queryBoolean(),
  upcoming: queryBoolean(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsSchema>;
