import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import { prisma } from "../../config/prisma.js";
import { visibilityWindowWhere } from "../../shared/utils/visibility.js";

const PENDING_STATUSES = ["SUBMITTED", "UNDER_REVIEW"] as const;

export const getStats = catchAsync(async (_req: Request, res: Response) => {
  const [
    pendingApplications,
    totalApplications,
    pendingExchangeApplications,
    totalExchangeApplications,
    announcements,
    partners,
    faculty,
    galleryImages,
    activeMous,
    liveOpportunities,
    visitors,
    unreadNotifications,
  ] = await Promise.all([
    prisma.studentApplication.count({ where: { status: { in: [...PENDING_STATUSES] } } }),
    prisma.studentApplication.count(),
    prisma.inboundExchangeApplication.count({
      where: { status: { in: [...PENDING_STATUSES] } },
    }),
    prisma.inboundExchangeApplication.count(),
    prisma.announcement.count(),
    prisma.partner.count(),
    prisma.faculty.count(),
    prisma.galleryImage.count(),
    prisma.mou.count({ where: { status: "ACTIVE" } }),
    prisma.opportunity.count({ where: { isActive: true, ...visibilityWindowWhere() } }),
    prisma.visitor.count(),
    prisma.notification.count({ where: { isRead: false } }),
  ]);

  res.status(200).json(
    successResponse("Stats fetched", {
      pendingApplications,
      totalApplications,
      pendingExchangeApplications,
      totalExchangeApplications,
      announcements,
      partners,
      faculty,
      galleryImages,
      activeMous,
      liveOpportunities,
      visitors,
      unreadNotifications,
    }),
  );
});
