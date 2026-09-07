import { signDocumentLink } from "../../shared/utils/signedLink.js";
import { hyperlinkCell, type CellValue, type SheetSpec } from "../../shared/utils/xlsx.js";

// Reproduces the IRO's own international students database layout: the 22
// columns of "SII-International admission" and "Internship Sem exch Program",
// in her order and with her headings (including the two repeated
// "issue date" / "expiry date" pairs — the first is the passport's, the second
// the visa's). Document columns are appended after those, each a signed link so
// a reviewer can open the file straight from the downloaded sheet.

/** Column headings, shared except where the two registers genuinely differ. */
function headersFor(joiningHeader: string, sponsorHeader: string): string[] {
  return [
    "Sl No",
    "Roll No",
    "Student Name",
    joiningHeader,
    "Nationality",
    sponsorHeader,
    "Program",
    "Institute Email ID",
    "Mobile Number",
    "S Form",
    "C Form",
    "Exit Date",
    "Faculty Advisor",
    "Citizenship no",
    "Passport no",
    "issue date",
    "expiry date",
    "Visa details",
    "issue date",
    "expiry date",
    "Place of issue",
    "Remarks",
  ];
}

export interface InboundDocumentColumn {
  /** Form field name, e.g. "passportCopy". */
  field: string;
  /** Prisma column holding the stored path, e.g. "passportCopyPath". */
  pathColumn: string;
  /** Spreadsheet heading. */
  header: string;
}

export interface InboundExportVariant {
  sheetName: string;
  joiningHeader: string;
  sponsorHeader: string;
  /** Route segment used to build signed document links. */
  linkScope: string;
  documents: readonly InboundDocumentColumn[];
}

export const ADMISSION_DOCUMENT_COLUMNS: readonly InboundDocumentColumn[] = [
  { field: "passportCopy", pathColumn: "passportCopyPath", header: "Passport Copy" },
  { field: "photo", pathColumn: "photoPath", header: "Photo" },
  { field: "academicTranscripts", pathColumn: "academicTranscriptsPath", header: "Transcripts" },
  { field: "englishTestScoreCard", pathColumn: "englishTestScoreCardPath", header: "English Test Score Card" },
  { field: "statementOfPurpose", pathColumn: "statementOfPurposePath", header: "Statement of Purpose" },
  { field: "financialProof", pathColumn: "financialProofPath", header: "Financial Proof" },
  { field: "recommendationLetter", pathColumn: "recommendationLetterPath", header: "Recommendation Letter" },
];

export const EXCHANGE_DOCUMENT_COLUMNS: readonly InboundDocumentColumn[] = [
  { field: "passportCopy", pathColumn: "passportCopyPath", header: "Passport Copy" },
  { field: "photo", pathColumn: "photoPath", header: "Photo" },
  { field: "academicTranscripts", pathColumn: "academicTranscriptsPath", header: "Transcripts" },
  { field: "nominationLetter", pathColumn: "nominationLetterPath", header: "Nomination Letter" },
  { field: "statementOfPurpose", pathColumn: "statementOfPurposePath", header: "Statement of Purpose" },
  { field: "financialProof", pathColumn: "financialProofPath", header: "Financial Proof" },
  { field: "recommendationLetter", pathColumn: "recommendationLetterPath", header: "Recommendation Letter" },
];

export const ADMISSION_EXPORT_VARIANT: InboundExportVariant = {
  sheetName: "SII-International admission",
  joiningHeader: "Year of Joining",
  sponsorHeader: "Sponsoring Agency",
  linkScope: "applications",
  documents: ADMISSION_DOCUMENT_COLUMNS,
};

export const EXCHANGE_EXPORT_VARIANT: InboundExportVariant = {
  sheetName: "Internship Sem exch Program",
  joiningHeader: "Date of Joining",
  sponsorHeader: "Sponsoring Agency /Uni",
  linkScope: "inbound-exchange",
  documents: EXCHANGE_DOCUMENT_COLUMNS,
};

/** The subset of either inbound model the spreadsheet reads. */
export interface InboundExportRecord {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  phone: string;
  passportNumber: string;
  passportExpiryDate: Date;
  rollNumber: string | null;
  instituteEmail: string | null;
  sponsoringAgency: string | null;
  yearOfJoining: string | null;
  dateOfJoining: Date | null;
  exitDate: Date | null;
  facultyAdvisor: string | null;
  citizenshipNo: string | null;
  passportIssueDate: Date | null;
  passportPlaceOfIssue: string | null;
  visaDetails: string | null;
  visaIssueDate: Date | null;
  visaExpiryDate: Date | null;
  visaPlaceOfIssue: string | null;
  sForm: string | null;
  cForm: string | null;
  officeRemarks: string | null;
  [documentPathColumn: string]: unknown;
}

export const fullName = (record: { firstName: string; lastName: string }): string =>
  `${record.firstName} ${record.lastName}`.trim();

/**
 * "Program" as the register means it: the degree applied for, or the kind of
 * exchange. Each module passes its own, since the two models name it
 * differently.
 */
export type ProgramLabelFn = (record: InboundExportRecord) => string;

export function buildInboundSheet(
  variant: InboundExportVariant,
  records: readonly InboundExportRecord[],
  programLabel: ProgramLabelFn,
): SheetSpec {
  const headers = [
    ...headersFor(variant.joiningHeader, variant.sponsorHeader),
    ...variant.documents.map((doc) => doc.header),
  ];

  const rows: CellValue[][] = records.map((record, index) => {
    // The admission register records a joining *year*, the exchange register a
    // full date; fall back to the other if only one was filled in.
    const joining: CellValue =
      variant.joiningHeader === "Year of Joining"
        ? (record.yearOfJoining ?? record.dateOfJoining ?? null)
        : (record.dateOfJoining ?? record.yearOfJoining ?? null);

    const base: CellValue[] = [
      index + 1,
      record.rollNumber,
      fullName(record),
      joining,
      record.nationality,
      record.sponsoringAgency,
      programLabel(record),
      record.instituteEmail,
      record.phone,
      record.sForm,
      record.cForm,
      record.exitDate,
      record.facultyAdvisor,
      record.citizenshipNo,
      record.passportNumber,
      record.passportIssueDate,
      record.passportExpiryDate,
      record.visaDetails,
      record.visaIssueDate,
      record.visaExpiryDate,
      record.visaPlaceOfIssue ?? record.passportPlaceOfIssue,
      record.officeRemarks,
    ];

    const documents: CellValue[] = variant.documents.map((doc) =>
      record[doc.pathColumn]
        ? hyperlinkCell(signDocumentLink(variant.linkScope, record.id, doc.field), "Open")
        : null,
    );

    return [...base, ...documents];
  });

  return { name: variant.sheetName, headers, rows };
}
