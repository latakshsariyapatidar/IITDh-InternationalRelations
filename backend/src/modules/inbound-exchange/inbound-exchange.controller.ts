import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import { sendWorkbook, timestampedFilename } from "../../shared/utils/xlsx.js";
import { sendPrivateDocument } from "../../shared/utils/sendPrivateDocument.js";
import * as service from "./inbound-exchange.service.js";
import type {
  CreateExchangeApplicationInput,
  UpdateExchangeApplicationStatusInput,
  UpdateExchangeApplicationRecordInput,
  ListExchangeApplicationsQuery,
  ExportExchangeApplicationsQuery,
} from "./inbound-exchange.schema.js";
import type { ExchangeDocumentField } from "./inbound-exchange.storage.js";

export const listExchangeApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await service.getAll(req.query as unknown as ListExchangeApplicationsQuery);
  res.status(200).json(successResponse("Exchange applications fetched", result));
});

export const getExchangeApplication = catchAsync(async (req: Request, res: Response) => {
  const item = await service.getById(req.params.id as string);
  res.status(200).json(successResponse("Exchange application fetched", item));
});

export const createExchangeApplication = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Partial<Record<ExchangeDocumentField, Express.Multer.File[]>>;
  const item = await service.create(req.body as CreateExchangeApplicationInput, files ?? {});
  res
    .status(201)
    .json(
      successResponse(
        "Application submitted successfully. You will be contacted by email regarding the status of your application.",
        { id: item.id },
      ),
    );
});

export const updateExchangeApplicationStatus = catchAsync(
  async (req: Request, res: Response) => {
    const item = await service.updateStatus(
      req.params.id as string,
      req.body as UpdateExchangeApplicationStatusInput,
      req.user!.adminId,
    );
    res.status(200).json(successResponse("Exchange application updated", item));
  },
);

export const updateExchangeApplicationRecord = catchAsync(
  async (req: Request, res: Response) => {
    const item = await service.updateRecord(
      req.params.id as string,
      req.body as UpdateExchangeApplicationRecordInput,
    );
    res.status(200).json(successResponse("Exchange application record updated", item));
  },
);

export const deleteExchangeApplication = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Exchange application deleted"));
});

export const exportExchangeApplications = catchAsync(async (req: Request, res: Response) => {
  const workbook = await service.buildExportWorkbook(
    req.query as unknown as ExportExchangeApplicationsQuery,
  );
  await sendWorkbook(res, workbook, timestampedFilename("inbound-exchange"));
});

export const downloadExchangeDocument = catchAsync(async (req: Request, res: Response) => {
  const field = req.params.field as ExchangeDocumentField;
  const absolutePath = await service.getDocumentAbsolutePath(req.params.id as string, field);
  sendPrivateDocument(res, absolutePath, `${req.params.id}-${field}`);
});
