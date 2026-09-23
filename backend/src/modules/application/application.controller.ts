import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import { sendWorkbook, timestampedFilename } from "../../shared/utils/xlsx.js";
import { sendPrivateDocument } from "../../shared/utils/sendPrivateDocument.js";
import { recordDocumentAccess } from "../../shared/utils/documentAccessLog.js";
import * as service from "./application.service.js";
import type {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  UpdateApplicationRecordInput,
  ListApplicationsQuery,
  ExportApplicationsQuery,
} from "./application.schema.js";
import type { DocumentField } from "./application.storage.js";

export const listApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await service.getAll(req.query as unknown as ListApplicationsQuery);
  res.status(200).json(successResponse("Applications fetched", result));
});

export const getApplication = catchAsync(async (req: Request, res: Response) => {
  const item = await service.getById(req.params.id as string);
  res.status(200).json(successResponse("Application fetched", item));
});

export const createApplication = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Partial<Record<DocumentField, Express.Multer.File[]>>;
  const item = await service.create(req.body as CreateApplicationInput, files ?? {});
  res
    .status(201)
    .json(
      successResponse(
        "Application submitted successfully. You will be contacted by email regarding the status of your application.",
        { id: item.id },
      ),
    );
});

export const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const item = await service.updateStatus(
    req.params.id as string,
    req.body as UpdateApplicationStatusInput,
    req.user!.adminId,
  );
  res.status(200).json(successResponse("Application updated", item));
});

export const updateApplicationRecord = catchAsync(async (req: Request, res: Response) => {
  const item = await service.updateRecord(
    req.params.id as string,
    req.body as UpdateApplicationRecordInput,
  );
  res.status(200).json(successResponse("Application record updated", item));
});

export const deleteApplication = catchAsync(async (req: Request, res: Response) => {
  await service.remove(req.params.id as string);
  res.status(200).json(successResponse("Application deleted"));
});

export const exportApplications = catchAsync(async (req: Request, res: Response) => {
  const workbook = await service.buildExportWorkbook(
    req.query as unknown as ExportApplicationsQuery,
  );
  await sendWorkbook(res, workbook, timestampedFilename("international-admissions"));
});

export const downloadApplicationDocument = catchAsync(async (req: Request, res: Response) => {
  const field = req.params.field as DocumentField;
  const absolutePath = await service.getDocumentAbsolutePath(req.params.id as string, field);

  // One row per successful download. Admin sessions and signed links from
  // exported spreadsheets both land here, and the log distinguishes them.
  recordDocumentAccess(req, {
    scope: "applications",
    recordId: req.params.id as string,
    field,
  });

  sendPrivateDocument(res, absolutePath, `${req.params.id}-${field}`);
});
