import { z } from "zod";

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
  imageUrl: z.string().url().max(500).optional(),
  type: EventType.default("OTHER"),
  isPublic: z.boolean().default(true),
});

export const updateEventSchema = createEventSchema.partial();
export const eventIdSchema = z.object({ id: z.string().uuid() });
export const listEventsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  type: EventType.optional(),
  isPublic: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
  upcoming: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsSchema>;
