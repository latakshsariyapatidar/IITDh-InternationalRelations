import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./page.service.js";
import type { PageKey } from "./page.constants.js";

export const getPage = catchAsync(async (req: Request, res: Response) => {
  const page = await service.getPage(req.params.page as PageKey);
  res.status(200).json(successResponse("Page data fetched", page));
});
