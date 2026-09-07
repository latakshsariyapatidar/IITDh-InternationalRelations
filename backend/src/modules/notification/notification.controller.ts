import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./notification.service.js";
import type { ListNotificationsQuery } from "./notification.schema.js";

export const listNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await service.getAll(req.query as unknown as ListNotificationsQuery);
  res.status(200).json(successResponse("Notifications fetched", result));
});

export const getUnreadCount = catchAsync(async (_req: Request, res: Response) => {
  const unread = await service.getUnreadCount();
  res.status(200).json(successResponse("Unread count fetched", { unread }));
});

export const markNotificationRead = catchAsync(async (req: Request, res: Response) => {
  const item = await service.markRead(req.params.id as string);
  res.status(200).json(successResponse("Notification marked as read", item));
});

export const markAllNotificationsRead = catchAsync(async (_req: Request, res: Response) => {
  const result = await service.markAllRead();
  res.status(200).json(successResponse("All notifications marked as read", result));
});

export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Notification deleted"));
});

// Manual trigger for the sweep the daily cron also runs.
export const scanNotifications = catchAsync(async (_req: Request, res: Response) => {
  const result = await service.scan();
  res.status(200).json(successResponse("Reminder scan complete", result));
});
