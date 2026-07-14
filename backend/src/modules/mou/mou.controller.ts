import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./mou.service.js";
import type { CreateMouInput, UpdateMouInput, ListMousQuery } from "./mou.schema.js";

export const listMous = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(successResponse("MOUs fetched", await service.getAll(req.query as unknown as ListMousQuery)));
});
export const getMou = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(successResponse("MOU fetched", await service.getById(req.params.id as string)));
});
export const createMou = catchAsync(async (req: Request, res: Response) => {
  res
    .status(201)
    .json(successResponse("MOU created", await service.create(req.body as CreateMouInput)));
});
export const updateMou = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "MOU updated",
        await service.update(req.params.id as string, req.body as UpdateMouInput),
      ),
    );
});
export const deleteMou = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("MOU deleted"));
});
