import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import AppError from "../../shared/utils/appError.js";
import * as service from "./opportunity.service.js";
import type {
  CreateOpportunityInput,
  UpdateOpportunityInput,
  ListOpportunitiesQuery,
  OpportunityFeedQuery,
} from "./opportunity.schema.js";

export const listOpportunities = catchAsync(async (req: Request, res: Response) => {
  const result = await service.getAll(
    req.query as unknown as ListOpportunitiesQuery,
    Boolean(req.user),
  );
  res.status(200).json(successResponse("Opportunities fetched", result));
});

// The signed-in campus feed: the caller's role decides the audience, so a
// student can never request the faculty list by changing a query parameter.
export const getOpportunityFeed = catchAsync(async (req: Request, res: Response) => {
  const campusUser = req.student;
  if (!campusUser) throw AppError.unauthorized("Sign-in required");

  const { limit } = req.query as unknown as OpportunityFeedQuery;
  const audience = campusUser.role === "faculty" ? "FACULTY" : "STUDENT";
  const opportunities = await service.getFeed(audience, limit);

  res
    .status(200)
    .json(successResponse("Latest opportunities fetched", { audience, opportunities }));
});

export const getOpportunity = catchAsync(async (req: Request, res: Response) => {
  const item = await service.getById(req.params.id as string, Boolean(req.user));
  res.status(200).json(successResponse("Opportunity fetched", item));
});

export const createOpportunity = catchAsync(async (req: Request, res: Response) => {
  const item = await service.create(req.body as CreateOpportunityInput);
  res.status(201).json(successResponse("Opportunity created", item));
});

export const updateOpportunity = catchAsync(async (req: Request, res: Response) => {
  const item = await service.update(
    req.params.id as string,
    req.body as UpdateOpportunityInput,
  );
  res.status(200).json(successResponse("Opportunity updated", item));
});

export const deleteOpportunity = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Opportunity deleted"));
});
