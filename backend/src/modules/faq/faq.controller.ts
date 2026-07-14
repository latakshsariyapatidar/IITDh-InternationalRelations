import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./faq.service.js";
import type {
  CreateFAQInput,
  UpdateFAQInput,
  ListFAQsQuery,
} from "./faq.schema.js";

export const listFAQs = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "FAQs fetched",
        await service.getAll(req.query as unknown as ListFAQsQuery),
      ),
    );
});
export const getFAQ = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "FAQ fetched",
        await service.getById(req.params.id as string),
      ),
    );
});
export const createFAQ = catchAsync(async (req: Request, res: Response) => {
  res
    .status(201)
    .json(
      successResponse(
        "FAQ created",
        await service.create(req.body as CreateFAQInput),
      ),
    );
});
export const updateFAQ = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "FAQ updated",
        await service.update(
          req.params.id as string,
          req.body as UpdateFAQInput,
        ),
      ),
    );
});
export const deleteFAQ = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("FAQ deleted"));
});
