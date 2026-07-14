import path from "node:path";
import * as repo from "./outbound-application.repository.js";
import AppError from "../../shared/utils/appError.js";
import { findPartnerById } from "../partner/partner.repository.js";
import { OUTBOUND_UPLOAD_ROOT, type OutboundDocumentField } from "./outbound-application.storage.js";
import type {
  CreateOutboundApplicationInput,
  UpdateOutboundApplicationStatusInput,
  ListOutboundApplicationsQuery,
} from "./outbound-application.schema.js";

export const getAll = (query: ListOutboundApplicationsQuery) => repo.findAllOutboundApplications(query);
export const getMine = (studentId: string) => repo.findOutboundApplicationsForStudent(studentId);

export async function getById(id: string) {
  const item = await repo.findOutboundApplicationById(id);
  if (!item) throw AppError.notFound("Outbound application not found");
  return item;
}

export async function create(
  studentId: string,
  data: CreateOutboundApplicationInput,
  files: Partial<Record<OutboundDocumentField, Express.Multer.File[]>>,
) {
  const partner = await findPartnerById(data.partnerId);
  if (!partner) throw AppError.badRequest("Selected partner institution does not exist");

  const documentPaths: Record<string, string> = {};
  for (const [field, fileArray] of Object.entries(files)) {
    const file = fileArray?.[0];
    if (file) documentPaths[field] = path.relative(OUTBOUND_UPLOAD_ROOT, file.path);
  }

  return repo.createOutboundApplication({ ...data, studentId, documentPaths });
}

export async function updateStatus(
  id: string,
  data: UpdateOutboundApplicationStatusInput,
  reviewedByAdminId: string,
) {
  await getById(id);
  return repo.updateOutboundApplicationStatus(id, data, reviewedByAdminId);
}

const FIELD_TO_COLUMN: Record<OutboundDocumentField, string> = {
  transcript: "transcriptPath",
  recommendationLetter: "recommendationLetterPath",
};

export async function getDocumentAbsolutePath(
  id: string,
  field: OutboundDocumentField,
): Promise<string> {
  const application = await getById(id);
  const column = FIELD_TO_COLUMN[field] as keyof typeof application;
  const relativePath = application[column] as string | null;

  if (!relativePath)
    throw AppError.notFound("This document was not submitted with the application");

  return path.join(OUTBOUND_UPLOAD_ROOT, relativePath);
}
