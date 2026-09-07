import * as repo from "./application.repository.js";
import AppError from "../../shared/utils/appError.js";
import {
  collectDocumentPaths,
  removeSubmissionFolder,
} from "../../shared/utils/privateStorage.js";
import { buildWorkbook } from "../../shared/utils/xlsx.js";
import {
  ADMISSION_EXPORT_VARIANT,
  buildInboundSheet,
  type InboundExportRecord,
} from "../inbound-shared/inbound-export.js";
import {
  anyDocumentPath,
  resolveDocumentAbsolutePath,
} from "../inbound-shared/inbound-documents.js";
import { notifyNewInboundApplication } from "../notification/notification.events.js";
import {
  DOCUMENT_FIELDS,
  PRIVATE_UPLOAD_ROOT,
  type DocumentField,
} from "./application.storage.js";
import type {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  UpdateApplicationRecordInput,
  ListApplicationsQuery,
  ExportApplicationsQuery,
} from "./application.schema.js";

export const getAll = (query: ListApplicationsQuery) => repo.findAllApplications(query);

export async function getById(id: string) {
  const item = await repo.findApplicationById(id);
  if (!item) throw AppError.notFound("Application not found");
  return item;
}

export async function create(
  data: CreateApplicationInput,
  files: Partial<Record<DocumentField, Express.Multer.File[]>>,
) {
  const documentPaths = collectDocumentPaths(PRIVATE_UPLOAD_ROOT, files);
  const application = await repo.createApplication({ ...data, documentPaths });

  // Best-effort: a failing reminder must never fail the applicant's submission.
  notifyNewInboundApplication({
    id: application.id,
    name: `${application.firstName} ${application.lastName}`,
    nationality: application.nationality,
    programAppliedFor: application.programAppliedFor,
  });

  return application;
}

export async function updateStatus(
  id: string,
  data: UpdateApplicationStatusInput,
  reviewedByAdminId: string,
) {
  await getById(id);
  return repo.updateApplicationStatus(id, data, reviewedByAdminId);
}

export async function updateRecord(id: string, data: UpdateApplicationRecordInput) {
  await getById(id);
  return repo.updateApplicationRecord(id, data);
}

export async function remove(id: string) {
  const application = await getById(id);
  await repo.deleteApplication(id);
  await removeSubmissionFolder(
    PRIVATE_UPLOAD_ROOT,
    anyDocumentPath(application, DOCUMENT_FIELDS),
  );
}

/** "Program" for the register: the degree applied for, plus a specified level. */
const programLabel = (record: InboundExportRecord): string => {
  const applied = String(record.programAppliedFor ?? "");
  const other = record.programLevel === "OTHER" ? record.programLevelOther : null;
  return other ? `${applied} (${String(other)})` : applied;
};

export async function buildExportWorkbook(query: ExportApplicationsQuery) {
  const applications = await repo.findApplicationsForExport(query);
  return buildWorkbook([
    buildInboundSheet(
      ADMISSION_EXPORT_VARIANT,
      applications as unknown as InboundExportRecord[],
      programLabel,
    ),
  ]);
}

export async function getDocumentAbsolutePath(
  id: string,
  field: DocumentField,
): Promise<string> {
  const application = await getById(id);
  return resolveDocumentAbsolutePath(PRIVATE_UPLOAD_ROOT, application, field);
}
