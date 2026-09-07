import * as repo from "./visitor.repository.js";
import AppError from "../../shared/utils/appError.js";
import { toCountryCode } from "../../shared/utils/country.js";
import { buildWorkbook, type CellValue } from "../../shared/utils/xlsx.js";
import { notifyNewVisitor } from "../notification/notification.events.js";
import type {
  CreateVisitorInput,
  UpdateVisitorInput,
  ListVisitorsQuery,
  ExportVisitorsQuery,
} from "./visitor.schema.js";

export const getAll = (query: ListVisitorsQuery) => repo.findAllVisitors(query);

export async function getById(id: string) {
  const item = await repo.findVisitorById(id);
  if (!item) throw AppError.notFound("Visitor not found");
  return item;
}

export async function create(data: CreateVisitorInput) {
  const countryCode = toCountryCode(data.country);
  const visitor = await repo.createVisitor({ ...data, ...(countryCode && { countryCode }) });

  // Best-effort: a failing notification must never fail the visitor's form.
  notifyNewVisitor({
    id: visitor.id,
    fullName: visitor.fullName,
    organisation: visitor.organisation,
    country: visitor.country,
    visitFrom: visitor.visitFrom,
  });

  return visitor;
}

export async function update(id: string, data: UpdateVisitorInput) {
  await getById(id);
  const countryCode =
    data.country && !data.countryCode ? toCountryCode(data.country) : undefined;
  return repo.updateVisitor(id, { ...data, ...(countryCode && { countryCode }) });
}

export async function remove(id: string) {
  await getById(id);
  return repo.deleteVisitor(id);
}

const EXPORT_HEADERS = [
  "Sl No",
  "Name",
  "Designation",
  "Organisation",
  "Department",
  "Country",
  "Nationality",
  "Email",
  "Phone",
  "Passport no",
  "Purpose of Visit",
  "Visit From",
  "Visit To",
  "Host",
  "Host Department",
  "Website / Profile",
  "Verified",
  "Remarks",
  "Submitted At",
] as const;

export async function buildExportWorkbook(query: ExportVisitorsQuery) {
  const visitors = await repo.findVisitorsForExport(query);

  const rows: CellValue[][] = visitors.map((visitor, index) => [
    index + 1,
    visitor.fullName,
    visitor.designation,
    visitor.organisation,
    visitor.department,
    visitor.country,
    visitor.nationality,
    visitor.email,
    visitor.phone,
    visitor.passportNumber,
    visitor.purposeOfVisit,
    visitor.visitFrom,
    visitor.visitTo,
    visitor.hostName,
    visitor.hostDepartment,
    visitor.websiteOrProfileUrl,
    visitor.isVerified ? "Yes" : "No",
    visitor.remarks,
    visitor.createdAt,
  ]);

  return buildWorkbook([{ name: "Visitors", headers: [...EXPORT_HEADERS], rows }]);
}
