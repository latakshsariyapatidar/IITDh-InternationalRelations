import { createPrivateUpload } from "../../shared/utils/privateStorage.js";

// Exchange applicants send a nomination letter from their home university in
// place of the English test score card a degree applicant submits.
export const EXCHANGE_DOCUMENT_FIELDS = [
  "passportCopy",
  "photo",
  "academicTranscripts",
  "nominationLetter",
  "statementOfPurpose",
  "financialProof",
  "recommendationLetter",
] as const;

export type ExchangeDocumentField = (typeof EXCHANGE_DOCUMENT_FIELDS)[number];

const { root, upload } = createPrivateUpload({
  folder: "inbound-exchange",
  fields: EXCHANGE_DOCUMENT_FIELDS,
  rejectionMessage: "Only PDF, JPEG, or PNG files are accepted for application documents",
});

export const EXCHANGE_UPLOAD_ROOT = root;
export const exchangeDocumentUpload = upload;
