import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./announcement.service.js";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  ListAnnouncementsQuery,
} from "./announcement.schema.js";

export const listAnnouncements = catchAsync(
  async (req: Request, res: Response) => {
    const result = await service.getAll(
      req.query as unknown as ListAnnouncementsQuery,
    );
    res.status(200).json(successResponse("Announcements fetched", result));
  },
);

export const getAnnouncement = catchAsync(
  async (req: Request, res: Response) => {
    const item = await service.getById(req.params.id);
    res.status(200).json(successResponse("Announcement fetched", item));
  },
);

export const createAnnouncement = catchAsync(
  async (req: Request, res: Response) => {
    const item = await service.create(req.body as CreateAnnouncementInput);
    res.status(201).json(successResponse("Announcement created", item));
  },
);

export const updateAnnouncement = catchAsync(
  async (req: Request, res: Response) => {
    const item = await service.update(
      req.params.id,
      req.body as UpdateAnnouncementInput,
    );
    res.status(200).json(successResponse("Announcement updated", item));
  },
);

export const deleteAnnouncement = catchAsync(
  async (req: Request, res: Response) => {
    await service.remove(req.params.id);
    res.status(200).json(successResponse("Announcement deleted"));
  },
);
