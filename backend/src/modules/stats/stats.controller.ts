import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import { prisma } from "../../config/prisma.js";

export const getStats = catchAsync(async (_req: Request, res: Response) => {
  const [
    pendingApplications, 
    totalApplications, 
    pendingOutboundApplications, 
    totalOutboundApplications, 
    announcements, 
    partners, 
    faculty, 
    galleryImages, 
    activeMous
  ] =
    await Promise.all([
      prisma.studentApplication.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.studentApplication.count(),
      prisma.outboundApplication.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.outboundApplication.count(),
      prisma.announcement.count(),
      prisma.partner.count(),
      prisma.faculty.count(),
      prisma.galleryImage.count(),
      prisma.mou.count({ where: { status: "ACTIVE" } }),
    ]);

  res.status(200).json(
    successResponse("Stats fetched", {
      pendingApplications,
      totalApplications,
      pendingOutboundApplications,
      totalOutboundApplications,
      announcements,
      partners,
      faculty,
      galleryImages,
      activeMous,
    }),
  );
});
