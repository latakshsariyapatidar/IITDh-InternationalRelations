import { z } from "zod";

const NotificationTypeEnum = z.enum([
  "VISA_EXPIRING",
  "PASSPORT_EXPIRING",
  "MOU_EXPIRING",
  "EXIT_DATE_APPROACHING",
  "NEW_INBOUND_APPLICATION",
  "NEW_EXCHANGE_APPLICATION",
  "NEW_VISITOR",
  "OTHER",
]);

const NotificationSeverityEnum = z.enum(["INFO", "WARNING", "CRITICAL"]);

export const listNotificationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isRead: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
  type: NotificationTypeEnum.optional(),
  severity: NotificationSeverityEnum.optional(),
});

export const notificationIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema>;
