import { createPrivateUpload } from "../../shared/utils/privateStorage.js";

export const DOCUMENT_FIELDS = [
  "passportCopy",
  "photo",
  "academicTranscripts",
  "englishTestScoreCard",
  "statementOfPurpose",
  "financialProof",
  "recommendationLetter",
] as const;

export type DocumentField = (typeof DOCUMENT_FIELDS)[number];

const { root, upload } = createPrivateUpload({
  folder: "applications",
  fields: DOCUMENT_FIELDS,
  rejectionMessage: "Only PDF, JPEG, or PNG files are accepted for application documents",
});

export const PRIVATE_UPLOAD_ROOT = root;
export const applicationDocumentUpload = upload;
