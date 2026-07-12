import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./download.service.js";
import type {
  CreateDownloadInput,
  UpdateDownloadInput,
  ListDownloadsQuery,
} from "./download.schema.js";

export const listDownloads = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Downloads fetched",
        await service.getAll(req.query as unknown as ListDownloadsQuery),
      ),
    );
});
export const getDownload = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      successResponse(
        "Download fetched",
        await service.getById(req.params.id as string),
      ),
    );
});
export const createDownload = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(201)
      .json(
        successResponse(
          "Download created",
          await service.create(req.body as CreateDownloadInput),
        ),
      );
  },
);
export const updateDownload = catchAsync(
  async (req: Request, res: Response) => {
    res
      .status(200)
      .json(
        successResponse(
          "Download updated",
          await service.update(
            req.params.id as string,
            req.body as UpdateDownloadInput,
          ),
        ),
      );
  },
);
export const deleteDownload = catchAsync(
  async (req: Request, res: Response) => {
    await service.remove(req.params.id as string);
    res.status(200).json(successResponse("Download deleted"));
  },
);
