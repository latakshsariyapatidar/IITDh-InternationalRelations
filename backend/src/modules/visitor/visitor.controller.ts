import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import { sendWorkbook, timestampedFilename } from "../../shared/utils/xlsx.js";
import * as service from "./visitor.service.js";
import type {
  CreateVisitorInput,
  UpdateVisitorInput,
  ListVisitorsQuery,
  ExportVisitorsQuery,
} from "./visitor.schema.js";

export const listVisitors = catchAsync(async (req: Request, res: Response) => {
  const result = await service.getAll(req.query as unknown as ListVisitorsQuery);
  res.status(200).json(successResponse("Visitors fetched", result));
});

export const listPublicVisitors = catchAsync(async (_req: Request, res: Response) => {
  const visitors = await service.getPublicVisitors();
  res.status(200).json(successResponse("Public visits fetched", { visitors }));
});


export const getVisitor = catchAsync(async (req: Request, res: Response) => {
  const item = await service.getById(req.params.id as string);
  res.status(200).json(successResponse("Visitor fetched", item));
});

export const createVisitor = catchAsync(async (req: Request, res: Response) => {
  const item = await service.create(req.body as CreateVisitorInput);
  // Only the id goes back: the form is public, so the response must not echo
  // the personal details it just stored.
  res
    .status(201)
    .json(
      successResponse(
        "Thank you — your details have been recorded. The International Relations Office will be in touch.",
        { id: item.id },
      ),
    );
});

export const updateVisitor = catchAsync(async (req: Request, res: Response) => {
  const item = await service.update(req.params.id as string, req.body as UpdateVisitorInput);
  res.status(200).json(successResponse("Visitor updated", item));
});

export const deleteVisitor = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Visitor deleted"));
});

export const exportVisitors = catchAsync(async (req: Request, res: Response) => {
  const workbook = await service.buildExportWorkbook(
    req.query as unknown as ExportVisitorsQuery,
  );
  await sendWorkbook(res, workbook, timestampedFilename("visitors"));
});
