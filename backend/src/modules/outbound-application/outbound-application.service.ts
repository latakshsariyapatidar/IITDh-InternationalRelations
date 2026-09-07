import * as repo from "./outbound-application.repository.js";
import AppError from "../../shared/utils/appError.js";
import { findPartnerById } from "../partner/partner.repository.js";
import { collectDocumentPaths } from "../../shared/utils/privateStorage.js";
import { resolveDocumentAbsolutePath } from "../inbound-shared/inbound-documents.js";
import {
  OUTBOUND_UPLOAD_ROOT,
  type OutboundDocumentField,
} from "./outbound-application.storage.js";
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

  const documentPaths = collectDocumentPaths(OUTBOUND_UPLOAD_ROOT, files);

  // The statement of purpose may be typed into the form or uploaded as a PDF,
  // but one of the two is required. This lives here rather than in the zod
  // schema because multer consumes the files before validation runs, so the
  // schema cannot see whether a file was attached.
  if (!data.statementOfPurposeText && !documentPaths.statementOfPurpose) {
    throw AppError.badRequest(
      "Provide your statement of purpose either as text or as a PDF upload",
    );
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

export async function getDocumentAbsolutePath(
  id: string,
  field: OutboundDocumentField,
): Promise<string> {
  const application = await getById(id);
  return resolveDocumentAbsolutePath(OUTBOUND_UPLOAD_ROOT, application, field);
}
