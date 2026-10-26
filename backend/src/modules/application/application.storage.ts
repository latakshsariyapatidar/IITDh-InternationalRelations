import { createPrivateUpload } from "../../shared/utils/privateStorage.js";

// The form uploads two files: every document scanned into one PDF
// (combinedDocuments) and the photo. The other fields stay so documents from
// applications submitted before that change can still be opened.
export const DOCUMENT_FIELDS = [
  "combinedDocuments",
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
  // One PDF now carries grade cards, SOP, two recommendations, passport/ID,
  // work experience and publications, so it gets more room than the default.
  maxFileSizeBytes: 10 * 1024 * 1024,
});

export const PRIVATE_UPLOAD_ROOT = root;
export const applicationDocumentUpload = upload;
