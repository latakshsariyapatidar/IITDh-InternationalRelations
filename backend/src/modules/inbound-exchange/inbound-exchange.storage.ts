import { createPrivateUpload } from "../../shared/utils/privateStorage.js";

// Exchange applicants send a nomination letter from their home university in
// place of the English test score card a degree applicant submits. The form
// asks for photo, passport, CV, transcripts, nomination letter and (for a
// research internship) the IITDH professor's acceptance letter; the SOP,
// financial proof and recommendation fields remain for older applications.
export const EXCHANGE_DOCUMENT_FIELDS = [
  "passportCopy",
  "photo",
  "academicTranscripts",
  "nominationLetter",
  "statementOfPurpose",
  "financialProof",
  "recommendationLetter",
  "cv",
  "acceptanceLetter",
] as const;

export type ExchangeDocumentField = (typeof EXCHANGE_DOCUMENT_FIELDS)[number];

const { root, upload } = createPrivateUpload({
  folder: "inbound-exchange",
  fields: EXCHANGE_DOCUMENT_FIELDS,
  rejectionMessage: "Only PDF, JPEG, or PNG files are accepted for application documents",
});

export const EXCHANGE_UPLOAD_ROOT = root;
export const exchangeDocumentUpload = upload;
