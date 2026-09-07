import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type {
  CreateExchangeApplicationInput,
  UpdateExchangeApplicationStatusInput,
  UpdateExchangeApplicationRecordInput,
  ListExchangeApplicationsQuery,
  ExportExchangeApplicationsQuery,
} from "./inbound-exchange.schema.js";

const LIST_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  nationality: true,
  email: true,
  homeUniversity: true,
  homeUniversityCountry: true,
  exchangeType: true,
  exchangeTypeOther: true,
  programLevel: true,
  intendedStayFrom: true,
  intendedStayTo: true,
  status: true,
  submittedAt: true,
  // Office record columns worth seeing in the list.
  rollNumber: true,
  facultyAdvisor: true,
  visaExpiryDate: true,
  exitDate: true,
} satisfies Prisma.InboundExchangeApplicationSelect;

function buildWhere(
  query: ListExchangeApplicationsQuery | ExportExchangeApplicationsQuery,
): Prisma.InboundExchangeApplicationWhereInput {
  return {
    ...(query.status && { status: query.status }),
    ...(query.nationality && {
      nationality: { contains: query.nationality, mode: "insensitive" },
    }),
    ...(query.exchangeType && { exchangeType: query.exchangeType }),
    ...(query.homeUniversity && {
      homeUniversity: { contains: query.homeUniversity, mode: "insensitive" },
    }),
    ...(query.search && {
      OR: [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ],
    }),
  };
}

export async function findAllExchangeApplications(query: ListExchangeApplicationsQuery) {
  const where = buildWhere(query);

  const [applications, total] = await Promise.all([
    prisma.inboundExchangeApplication.findMany({
      where,
      select: LIST_SELECT,
      orderBy: { submittedAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.inboundExchangeApplication.count({ where }),
  ]);

  return { applications, total, page: query.page, limit: query.limit };
}

/** Full rows for the spreadsheet export. */
export const findExchangeApplicationsForExport = (query: ExportExchangeApplicationsQuery) =>
  prisma.inboundExchangeApplication.findMany({
    where: buildWhere(query),
    orderBy: { submittedAt: "asc" },
  });

export const findExchangeApplicationById = (id: string) =>
  prisma.inboundExchangeApplication.findUnique({ where: { id } });

export const createExchangeApplication = (
  data: CreateExchangeApplicationInput & { documentPaths: Record<string, string> },
) => {
  const { documentPaths, ...rest } = data;
  return prisma.inboundExchangeApplication.create({
    data: {
      ...rest,
      passportCopyPath: documentPaths.passportCopy,
      photoPath: documentPaths.photo,
      academicTranscriptsPath: documentPaths.academicTranscripts,
      nominationLetterPath: documentPaths.nominationLetter,
      statementOfPurposePath: documentPaths.statementOfPurpose,
      financialProofPath: documentPaths.financialProof,
      recommendationLetterPath: documentPaths.recommendationLetter,
    },
  });
};

export const updateExchangeApplicationStatus = (
  id: string,
  data: UpdateExchangeApplicationStatusInput,
  reviewedByAdminId: string,
) =>
  prisma.inboundExchangeApplication.update({
    where: { id },
    data: { ...data, reviewedByAdminId },
  });

export const updateExchangeApplicationRecord = (
  id: string,
  data: UpdateExchangeApplicationRecordInput,
) => prisma.inboundExchangeApplication.update({ where: { id }, data });

export const deleteExchangeApplication = (id: string) =>
  prisma.inboundExchangeApplication.delete({ where: { id } });
