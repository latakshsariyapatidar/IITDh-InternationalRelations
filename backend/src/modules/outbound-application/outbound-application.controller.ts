import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./outbound-application.service.js";
import type {
  CreateOutboundApplicationInput,
  UpdateOutboundApplicationStatusInput,
  ListOutboundApplicationsQuery,
} from "./outbound-application.schema.js";
import type { OutboundDocumentField } from "./outbound-application.storage.js";

export const listOutboundApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await service.getAll(req.query as unknown as ListOutboundApplicationsQuery);
  res.status(200).json(successResponse("Outbound applications fetched", result));
});

export const listMyOutboundApplications = catchAsync(async (req: Request, res: Response) => {
  const items = await service.getMine(req.student!.studentId);
  res.status(200).json(successResponse("Your outbound applications fetched", items));
});

export const getOutboundApplication = catchAsync(async (req: Request, res: Response) => {
  const item = await service.getById(req.params.id as string);
  res.status(200).json(successResponse("Outbound application fetched", item));
});

export const createOutboundApplication = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Partial<Record<OutboundDocumentField, Express.Multer.File[]>>;
  const item = await service.create(
    req.student!.studentId,
    req.body as CreateOutboundApplicationInput,
    files ?? {},
  );
  res.status(201).json(successResponse("Application submitted", { id: item.id }));
});

export const updateOutboundApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const item = await service.updateStatus(
    req.params.id as string,
    req.body as UpdateOutboundApplicationStatusInput,
    req.user!.adminId,
  );
  res.status(200).json(successResponse("Application updated", item));
});
