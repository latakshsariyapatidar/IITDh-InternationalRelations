import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import AppError from "../../shared/utils/appError.js";
import { sendPrivateDocument } from "../../shared/utils/sendPrivateDocument.js";
import { recordDocumentAccess } from "../../shared/utils/documentAccessLog.js";
import * as service from "./mou.service.js";
import type { CreateMouInput, UpdateMouInput, ListMousQuery } from "./mou.schema.js";

export const listMous = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(successResponse("MOUs fetched", await service.getAll(req.query as unknown as ListMousQuery, Boolean(req.user))));
});
export const getMou = catchAsync(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(successResponse("MOU fetched", await service.getById(req.params.id as string, Boolean(req.user))));
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

export const uploadMouDocument = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('A PDF file is required under the "file" field');

  const item = await service.attachDocument(req.params.id as string, req.file.filename);
  res.status(200).json(successResponse("MOU document uploaded", item));
});

// Gated by authenticateIitdh: the MOU record is public, the signed document is
// only for IIT Dharwad accounts.
export const downloadMouDocument = catchAsync(async (req: Request, res: Response) => {
  // authenticateIitdh admits an admin (req.user) or a campus account
  // (req.student). A non-public MOU is the office's own record, so only the
  // admin branch may reach its signed PDF.
  const absolutePath = await service.getDocumentAbsolutePath(
    req.params.id as string,
    Boolean(req.user),
  );

  recordDocumentAccess(req, {
    scope: "mous",
    recordId: req.params.id as string,
    field: "document",
  });

  sendPrivateDocument(res, absolutePath, `mou-${req.params.id}`);
});
