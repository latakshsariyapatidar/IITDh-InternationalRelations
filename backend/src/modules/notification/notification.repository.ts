import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import type { ListNotificationsQuery } from "./notification.schema.js";

export interface NewNotification {
  type: Prisma.NotificationCreateInput["type"];
  severity?: Prisma.NotificationCreateInput["severity"];
  title: string;
  message: string;
  entityType?: string;
  entityId?: string;
  dueDate?: Date;
  dedupeKey: string;
}

/**
 * Creates a notification unless its `dedupeKey` already exists, returning null
 * in that case. The daily reminder scan re-evaluates every record every run, so
 * this is what keeps one expiring visa from producing a notification a day.
 */
export async function createNotificationIfNew(data: NewNotification) {
  try {
    return await prisma.notification.create({ data });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return null;
    }
    throw err;
  }
}

export async function findAllNotifications(query: ListNotificationsQuery) {
  const where: Prisma.NotificationWhereInput = {
    ...(query.isRead !== undefined && { isRead: query.isRead }),
    ...(query.type && { type: query.type }),
    ...(query.severity && { severity: query.severity }),
  };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      // Unread first, then most urgent by due date, then newest.
      orderBy: [{ isRead: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return { notifications, total, page: query.page, limit: query.limit };
}

export const countUnreadNotifications = () =>
  prisma.notification.count({ where: { isRead: false } });

export const findNotificationById = (id: string) =>
  prisma.notification.findUnique({ where: { id } });

export const markNotificationRead = (id: string) =>
  prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });

export const markAllNotificationsRead = () =>
  prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true, readAt: new Date() },
  });

export const markNotificationsEmailed = (ids: readonly string[]) =>
  prisma.notification.updateMany({
    where: { id: { in: [...ids] } },
    data: { emailedAt: new Date() },
  });

export const deleteNotification = (id: string) =>
  prisma.notification.delete({ where: { id } });
