import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";

// A student belongs in a date-range report when their stay overlaps it, not
// when they happened to apply during it. "Stay" is the office record's joining
// and exit dates, falling back to the dates the applicant proposed.

export interface DateRange {
  from: Date;
  to: Date;
}

// Only records that represent a real or prospective stay; rejected and
// withdrawn applications never appear in a report.
const REPORT_STATUSES = [
  "ACCEPTED",
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUESTED",
  "WAITLISTED",
] as const;

export const findAdmissionsInRange = ({ from, to }: DateRange) =>
  prisma.studentApplication.findMany({
    where: {
      status: { in: [...REPORT_STATUSES] },
      // Started on or before `to` — the office date if recorded, else the
      // submission date.
      OR: [{ dateOfJoining: { lte: to } }, { dateOfJoining: null, submittedAt: { lte: to } }],
      // Had not already left before `from`; a missing exit date means still here.
      AND: [{ OR: [{ exitDate: { gte: from } }, { exitDate: null }] }],
    } satisfies Prisma.StudentApplicationWhereInput,
    orderBy: [{ dateOfJoining: "asc" }, { submittedAt: "asc" }],
  });

export const findExchangesInRange = ({ from, to }: DateRange) =>
  prisma.inboundExchangeApplication.findMany({
    where: {
      status: { in: [...REPORT_STATUSES] },
      // Exchange applicants always give intended dates, so those are the
      // fallback when the office record is not filled in yet.
      OR: [
        { dateOfJoining: { lte: to } },
        { dateOfJoining: null, intendedStayFrom: { lte: to } },
      ],
      AND: [
        {
          OR: [
            { exitDate: { gte: from } },
            { exitDate: null, intendedStayTo: { gte: from } },
          ],
        },
      ],
    } satisfies Prisma.InboundExchangeApplicationWhereInput,
    orderBy: [{ dateOfJoining: "asc" }, { intendedStayFrom: "asc" }],
  });

export const findVisitorsInRange = ({ from, to }: DateRange) =>
  prisma.visitor.findMany({
    where: {
      visitFrom: { lte: to },
      OR: [{ visitTo: { gte: from } }, { visitTo: null }],
    } satisfies Prisma.VisitorWhereInput,
    orderBy: { visitFrom: "asc" },
  });
