import * as repo from "./notification.repository.js";
import AppError from "../../shared/utils/appError.js";
import { runReminderScan } from "./notification.reminders.js";
import type { ListNotificationsQuery } from "./notification.schema.js";

export const getAll = (query: ListNotificationsQuery) => repo.findAllNotifications(query);
export const getUnreadCount = () => repo.countUnreadNotifications();
export const scan = () => runReminderScan();

async function getById(id: string) {
  const item = await repo.findNotificationById(id);
  if (!item) throw AppError.notFound("Notification not found");
  return item;
}

export async function markRead(id: string) {
  await getById(id);
  return repo.markNotificationRead(id);
}

export async function markAllRead() {
  const { count } = await repo.markAllNotificationsRead();
  return { updated: count };
}

export async function remove(id: string) {
  await getById(id);
  return repo.deleteNotification(id);
}
