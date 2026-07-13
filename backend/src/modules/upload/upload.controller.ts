import type { Request, Response } from "express";
import path from "node:path";
import fs from "node:fs/promises";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import AppError from "../../shared/utils/appError.js";
import { UPLOAD_ROOT } from "../../shared/constants/upload.constants.js";

function fileToUrl(file: Express.Multer.File): string {
  const folder = path.basename(path.dirname(file.path));
  return `/uploads/${folder}/${file.filename}`;
}

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file)
    throw AppError.badRequest('No file uploaded — field name must be "file"');
  res.status(201).json(successResponse("Image uploaded", { url: fileToUrl(req.file) }));
});

export const uploadDocument = catchAsync(async (req: Request, res: Response) => {
  if (!req.file)
    throw AppError.badRequest('No file uploaded — field name must be "file"');
  res
    .status(201)
    .json(successResponse("Document uploaded", { url: fileToUrl(req.file) }));
});

export const deleteUpload = catchAsync(async (req: Request, res: Response) => {
  const url = req.query.url;
  if (typeof url !== "string" || !url)
    throw AppError.badRequest('Query param "url" is required');

  const relative = url.replace(/^\/uploads\//, "");
  const resolved = path.resolve(UPLOAD_ROOT, relative);

  if (!resolved.startsWith(UPLOAD_ROOT + path.sep)) {
    throw AppError.badRequest("Invalid file path");
  }

  await fs.unlink(resolved).catch((err: NodeJS.ErrnoException) => {
    if (err.code !== "ENOENT") throw err;
  });

  res.status(200).json(successResponse("File deleted"));
});
