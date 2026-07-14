import path from "node:path";
import fs from "node:fs/promises";
import * as repo from "./application.repository.js";
import AppError from "../../shared/utils/appError.js";
import { PRIVATE_UPLOAD_ROOT, type DocumentField } from "./application.storage.js";
import type {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  ListApplicationsQuery,
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
  const documentPaths: Record<string, string> = {};

  for (const [field, fileArray] of Object.entries(files)) {
    const file = fileArray?.[0];
    if (file) {
      documentPaths[field] = path.relative(PRIVATE_UPLOAD_ROOT, file.path);
    }
  }

  return repo.createApplication({ ...data, documentPaths });
}

export async function updateStatus(
  id: string,
  data: UpdateApplicationStatusInput,
  reviewedByAdminId: string,
) {
  await getById(id);
  return repo.updateApplicationStatus(id, data, reviewedByAdminId);
}

export async function remove(id: string) {
  const application = await getById(id);
  await repo.deleteApplication(id);

  const anyPath = application.passportCopyPath ?? application.photoPath;
  if (anyPath) {
    const submissionFolder = path.join(
      PRIVATE_UPLOAD_ROOT,
      anyPath.split(path.sep)[0]!,
    );
    await fs.rm(submissionFolder, { recursive: true, force: true }).catch(() => {});
  }
}

const FIELD_TO_COLUMN: Record<DocumentField, string> = {
  passportCopy: "passportCopyPath",
  photo: "photoPath",
  academicTranscripts: "academicTranscriptsPath",
  englishTestScoreCard: "englishTestScoreCardPath",
  statementOfPurpose: "statementOfPurposePath",
  financialProof: "financialProofPath",
  recommendationLetter: "recommendationLetterPath",
};

export async function getDocumentAbsolutePath(
  id: string,
  field: DocumentField,
): Promise<string> {
  const application = await getById(id);
  const column = FIELD_TO_COLUMN[field] as keyof typeof application;
  const relativePath = application[column] as string | null;

  if (!relativePath)
    throw AppError.notFound("This document was not submitted with the application");

  return path.join(PRIVATE_UPLOAD_ROOT, relativePath);
}
