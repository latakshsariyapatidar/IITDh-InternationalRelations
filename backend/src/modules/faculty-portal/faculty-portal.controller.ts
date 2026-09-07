import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import AppError from "../../shared/utils/appError.js";
import { prisma } from "../../config/prisma.js";
import * as opportunityService from "../opportunity/opportunity.service.js";

export const getFacultyProfile = catchAsync(async (req: Request, res: Response) => {
  const { facultyId, email } = req.student!;
  if (!facultyId) throw AppError.forbidden("This account is not linked to a faculty profile");

  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
    select: { id: true, name: true, email: true, redirectUrl: true, isActive: true },
  });

  if (!faculty) throw AppError.notFound("Faculty profile not found");

  res.status(200).json(successResponse("Faculty profile fetched", { ...faculty, email }));
});

// The headline list for the faculty portal — latest postings marked FACULTY or
// BOTH, newest first.
export const getFacultyOpportunities = catchAsync(async (req: Request, res: Response) => {
  const { limit } = req.query as unknown as { limit: number };
  const opportunities = await opportunityService.getFeed("FACULTY", limit);
  res.status(200).json(successResponse("Latest opportunities fetched", { opportunities }));
});
