import { createPrivateUpload } from "../../shared/utils/privateStorage.js";

export const OUTBOUND_DOCUMENT_FIELDS = [
  "statementOfPurpose",
  "transcript",
  "recommendationLetter",
] as const;

export type OutboundDocumentField = (typeof OUTBOUND_DOCUMENT_FIELDS)[number];

const { root, upload } = createPrivateUpload({
  folder: "outbound-applications",
  fields: OUTBOUND_DOCUMENT_FIELDS,
});

export const OUTBOUND_UPLOAD_ROOT = root;
export const outboundDocumentUpload = upload;
