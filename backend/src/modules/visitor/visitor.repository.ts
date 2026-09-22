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

export async function findPublicVisitors() {
  return prisma.visitor.findMany({
    where: { isVerified: true },
    select: {
      id: true,
      fullName: true,
      designation: true,
      organisation: true,
      country: true,
      countryCode: true,
      purposeOfVisit: true,
      visitFrom: true,
      visitTo: true,
      hostName: true,
      hostDepartment: true,
      isVerified: true,
      createdAt: true,
    },
    orderBy: { visitFrom: "desc" },
    take: 50,
  });
}
