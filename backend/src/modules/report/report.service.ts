import * as repo from "./report.repository.js";
import { buildWorkbook, type CellValue } from "../../shared/utils/xlsx.js";
import {
  ADMISSION_EXPORT_VARIANT,
  EXCHANGE_EXPORT_VARIANT,
  buildInboundSheet,
  fullName,
  type InboundExportRecord,
} from "../inbound-shared/inbound-export.js";
import type { InboundReportQuery, VisitorReportQuery } from "./report.schema.js";

// The on-screen report is the six columns the office asked for; the download is
// their own spreadsheet format, produced from the same rows.

export interface InboundReportRow {
  id: string;
  register: "admission" | "exchange";
  studentName: string;
  nationality: string;
  homeUniversity: string;
  programName: string;
  facultyAdvisor: string | null;
  stayFrom: Date | null;
  stayTo: Date | null;
}

const EXCHANGE_TYPE_LABELS: Record<string, string> = {
  SEMESTER_EXCHANGE: "Semester Exchange",
  RESEARCH_INTERNSHIP: "Research Internship",
  SUMMER_PROGRAM: "Summer Program",
  OTHER: "Other",
};

const admissionProgramLabel = (record: InboundExportRecord): string => {
  const applied = String(record.programAppliedFor ?? "");
  const other = record.programLevel === "OTHER" ? record.programLevelOther : null;
  return other ? `${applied} (${String(other)})` : applied;
};

const exchangeProgramLabel = (record: InboundExportRecord): string => {
  const type = String(record.exchangeType ?? "");
  if (type === "OTHER" && record.exchangeTypeOther) return String(record.exchangeTypeOther);
  return EXCHANGE_TYPE_LABELS[type] ?? type;
};

async function loadRegisters(query: InboundReportQuery) {
  const range = { from: query.from, to: query.to };

  const [admissions, exchanges] = await Promise.all([
    query.type === "exchange" ? Promise.resolve([]) : repo.findAdmissionsInRange(range),
    query.type === "admission" ? Promise.resolve([]) : repo.findExchangesInRange(range),
  ]);

  return { admissions, exchanges };
}

export async function buildInboundReport(query: InboundReportQuery): Promise<InboundReportRow[]> {
  const { admissions, exchanges } = await loadRegisters(query);

  const admissionRows: InboundReportRow[] = admissions.map((row) => ({
    id: row.id,
    register: "admission",
    studentName: fullName(row),
    nationality: row.nationality,
    // A degree applicant's "home university" is where they studied before.
    homeUniversity: row.previousInstitution,
    programName: admissionProgramLabel(row as unknown as InboundExportRecord),
    facultyAdvisor: row.facultyAdvisor,
    stayFrom: row.dateOfJoining,
    stayTo: row.exitDate,
  }));

  const exchangeRows: InboundReportRow[] = exchanges.map((row) => ({
    id: row.id,
    register: "exchange",
    studentName: fullName(row),
    nationality: row.nationality,
    homeUniversity: row.homeUniversity,
    programName: exchangeProgramLabel(row as unknown as InboundExportRecord),
    facultyAdvisor: row.facultyAdvisor,
    // Fall back to the dates the applicant proposed until the office records
    // the actual ones.
    stayFrom: row.dateOfJoining ?? row.intendedStayFrom,
    stayTo: row.exitDate ?? row.intendedStayTo,
  }));

  return [...admissionRows, ...exchangeRows].sort(
    (a, b) => (a.stayFrom?.getTime() ?? 0) - (b.stayFrom?.getTime() ?? 0),
  );
}

/** Ma'am's workbook layout — one sheet per register in the requested range. */
export async function buildInboundReportWorkbook(query: InboundReportQuery) {
  const { admissions, exchanges } = await loadRegisters(query);

  const sheets = [];

  if (query.type !== "exchange") {
    sheets.push(
      buildInboundSheet(
        ADMISSION_EXPORT_VARIANT,
        admissions as unknown as InboundExportRecord[],
        admissionProgramLabel,
      ),
    );
  }

  if (query.type !== "admission") {
    sheets.push(
      buildInboundSheet(
        EXCHANGE_EXPORT_VARIANT,
        exchanges as unknown as InboundExportRecord[],
        exchangeProgramLabel,
      ),
    );
  }

  return buildWorkbook(sheets);
}

const VISITOR_HEADERS = [
  "Sl No",
  "Name",
  "Designation",
  "Organisation",
  "Country",
  "Email",
  "Phone",
  "Purpose of Visit",
  "Visit From",
  "Visit To",
  "Host",
  "Verified",
] as const;

export async function buildVisitorReport(query: VisitorReportQuery) {
  return repo.findVisitorsInRange({ from: query.from, to: query.to });
}

export async function buildVisitorReportWorkbook(query: VisitorReportQuery) {
  const visitors = await buildVisitorReport(query);

  const rows: CellValue[][] = visitors.map((visitor, index) => [
    index + 1,
    visitor.fullName,
    visitor.designation,
    visitor.organisation,
    visitor.country,
    visitor.email,
    visitor.phone,
    visitor.purposeOfVisit,
    visitor.visitFrom,
    visitor.visitTo,
    visitor.hostName,
    visitor.isVerified ? "Yes" : "No",
  ]);

  return buildWorkbook([{ name: "Visitors", headers: [...VISITOR_HEADERS], rows }]);
}
