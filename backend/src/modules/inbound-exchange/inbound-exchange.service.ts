import * as repo from "./inbound-exchange.repository.js";
import AppError from "../../shared/utils/appError.js";
import {
  collectDocumentPaths,
  removeSubmissionFolder,
} from "../../shared/utils/privateStorage.js";
import { buildWorkbook } from "../../shared/utils/xlsx.js";
import {
  EXCHANGE_EXPORT_VARIANT,
  buildInboundSheet,
  type InboundExportRecord,
} from "../inbound-shared/inbound-export.js";
import {
  anyDocumentPath,
  resolveDocumentAbsolutePath,
} from "../inbound-shared/inbound-documents.js";
import { notifyNewExchangeApplication } from "../notification/notification.events.js";
import {
  EXCHANGE_DOCUMENT_FIELDS,
  EXCHANGE_UPLOAD_ROOT,
  type ExchangeDocumentField,
} from "./inbound-exchange.storage.js";
import type {
  CreateExchangeApplicationInput,
  UpdateExchangeApplicationStatusInput,
  UpdateExchangeApplicationRecordInput,
  ListExchangeApplicationsQuery,
  ExportExchangeApplicationsQuery,
} from "./inbound-exchange.schema.js";

export const getAll = (query: ListExchangeApplicationsQuery) =>
  repo.findAllExchangeApplications(query);

export async function getById(id: string) {
  const item = await repo.findExchangeApplicationById(id);
  if (!item) throw AppError.notFound("Exchange application not found");
  return item;
}

export async function create(
  data: CreateExchangeApplicationInput,
  files: Partial<Record<ExchangeDocumentField, Express.Multer.File[]>>,
) {
  const documentPaths = collectDocumentPaths(EXCHANGE_UPLOAD_ROOT, files);
  const application = await repo.createExchangeApplication({ ...data, documentPaths });

  // Best-effort: a failing reminder must never fail the applicant's submission.
  notifyNewExchangeApplication({
    id: application.id,
    name: `${application.firstName} ${application.lastName}`,
    nationality: application.nationality,
    homeUniversity: application.homeUniversity,
  });

  return application;
}

export async function updateStatus(
  id: string,
  data: UpdateExchangeApplicationStatusInput,
  reviewedByAdminId: string,
) {
  await getById(id);
  return repo.updateExchangeApplicationStatus(id, data, reviewedByAdminId);
}

export async function updateRecord(id: string, data: UpdateExchangeApplicationRecordInput) {
  await getById(id);
  return repo.updateExchangeApplicationRecord(id, data);
}

export async function remove(id: string) {
  const application = await getById(id);
  await repo.deleteExchangeApplication(id);
  await removeSubmissionFolder(
    EXCHANGE_UPLOAD_ROOT,
    anyDocumentPath(application, EXCHANGE_DOCUMENT_FIELDS),
  );
}

const EXCHANGE_TYPE_LABELS: Record<string, string> = {
  SEMESTER_EXCHANGE: "Semester Exchange",
  RESEARCH_INTERNSHIP: "Research Internship",
  SUMMER_PROGRAM: "Summer Program",
  OTHER: "Other",
};

/** "Program" for the register: the kind of exchange this visitor is here on. */
const programLabel = (record: InboundExportRecord): string => {
  const type = String(record.exchangeType ?? "");
  if (type === "OTHER" && record.exchangeTypeOther) return String(record.exchangeTypeOther);
  return EXCHANGE_TYPE_LABELS[type] ?? type;
};

export async function buildExportWorkbook(query: ExportExchangeApplicationsQuery) {
  const applications = await repo.findExchangeApplicationsForExport(query);
  return buildWorkbook([
    buildInboundSheet(
      EXCHANGE_EXPORT_VARIANT,
      applications as unknown as InboundExportRecord[],
      programLabel,
    ),
  ]);
}

export async function getDocumentAbsolutePath(
  id: string,
  field: ExchangeDocumentField,
): Promise<string> {
  const application = await getById(id);
  return resolveDocumentAbsolutePath(EXCHANGE_UPLOAD_ROOT, application, field);
}
