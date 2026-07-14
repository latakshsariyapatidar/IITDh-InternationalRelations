import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./site-content.service.js";
import type {
  UpdateSiteContentInput,
  BulkUpdateSiteContentInput,
  ListSiteContentQuery,
} from "./site-content.schema.js";

export const listSiteContent = catchAsync(async (req: Request, res: Response) => {
  const result = await service.getAll(req.query as unknown as ListSiteContentQuery);
  res.status(200).json(successResponse("Site content fetched", result));
});

export const getSiteContent = catchAsync(async (req: Request, res: Response) => {
  const item = await service.getByKey(req.params.key as string);
  res.status(200).json(successResponse("Site content fetched", item));
});

export const updateSiteContent = catchAsync(async (req: Request, res: Response) => {
  const { value } = req.body as UpdateSiteContentInput;
  const item = await service.updateByKey(req.params.key as string, value);
  res.status(200).json(successResponse("Site content updated", item));
});

export const bulkUpdateSiteContent = catchAsync(async (req: Request, res: Response) => {
  const { updates } = req.body as BulkUpdateSiteContentInput;
  const items = await service.bulkUpdate(updates);
  res.status(200).json(successResponse("Site content updated", items));
});
