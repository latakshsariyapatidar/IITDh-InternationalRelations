import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type {
  CreateVisitorInput,
  UpdateVisitorInput,
  ListVisitorsQuery,
  ExportVisitorsQuery,
} from "./visitor.schema.js";

function buildWhere(
  query: ListVisitorsQuery | ExportVisitorsQuery,
): Prisma.VisitorWhereInput {
  return {
    ...(query.country && { country: { contains: query.country, mode: "insensitive" } }),
    ...(query.isVerified !== undefined && { isVerified: query.isVerified }),
    // Visits that start on or before `to` and are not already over by `from`.
    ...((query.from ?? query.to) && {
      visitFrom: {
        ...(query.from && { gte: query.from }),
        ...(query.to && { lte: query.to }),
      },
    }),
    ...(query.search && {
      OR: [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { organisation: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ],
    }),
  };
}

export async function findAllVisitors(query: ListVisitorsQuery) {
  const where = buildWhere(query);

  const [visitors, total] = await Promise.all([
    prisma.visitor.findMany({
      where,
      orderBy: { visitFrom: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.visitor.count({ where }),
  ]);

  return { visitors, total, page: query.page, limit: query.limit };
}

export const findVisitorsForExport = (query: ExportVisitorsQuery) =>
  prisma.visitor.findMany({ where: buildWhere(query), orderBy: { visitFrom: "asc" } });

export const findVisitorById = (id: string) => prisma.visitor.findUnique({ where: { id } });

export const createVisitor = (data: CreateVisitorInput & { countryCode?: string }) =>
  prisma.visitor.create({ data });

export const updateVisitor = (id: string, data: UpdateVisitorInput) =>
  prisma.visitor.update({ where: { id }, data });

export const deleteVisitor = (id: string) => prisma.visitor.delete({ where: { id } });

// There is deliberately no "find public visitors" query here.
//
// Visitor records are an internal office register. A delegate fills the form
// so the IRO knows who is on campus and can hold their contact details,
// passport number and travel dates. None of that is website content, and
// marking a record verified does not make it website content — it only means
// the office has checked it.
//
// This used to be published. The query had no `where` clause at all, so
// anything a stranger typed into an open form appeared on the public site
// within seconds under IIT Dharwad's name. Gating it on `isVerified` was the
// first fix; removing the public route altogether is the correct one, because
// the page it fed was never meant to show this data.
//
// The public Visits page is built from the events module instead.
