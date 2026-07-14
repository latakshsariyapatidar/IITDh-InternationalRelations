import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./gallery.service.js";
import type {
  CreateGalleryImageInput,
  UpdateGalleryImageInput,
  ListGalleryQuery,
} from "./gallery.schema.js";

export const listImages = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Gallery fetched",
        await service.getAll(req.query as unknown as ListGalleryQuery),
      ),
    );
});
export const getImage = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Image fetched",
        await service.getById(req.params.id as string),
      ),
    );
});
export const createImage = catchAsync(async (req: Request, res: Response) => {
  res
    .status(201)
    .json(
      successResponse(
        "Image added",
        await service.create(req.body as CreateGalleryImageInput),
      ),
    );
});
export const updateImage = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Image updated",
        await service.update(
          req.params.id as string,
          req.body as UpdateGalleryImageInput,
        ),
      ),
    );
});
export const deleteImage = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Image deleted"));
});
