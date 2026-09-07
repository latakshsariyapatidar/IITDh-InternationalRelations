import { createPrivateUpload } from "../../shared/utils/privateStorage.js";

export const OUTBOUND_DOCUMENT_FIELDS = [
  // The statement of purpose may be typed into the form or uploaded as a PDF.
  // `statementOfPurposePath` exists on the model and the repository writes it,
  // so dropping it here would make multer reject the field and orphan every
  // SOP already on disk.
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
