import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type {
  CreateApplicationInput,
  UpdateApplicationStatusInput,
  UpdateApplicationRecordInput,
  ListApplicationsQuery,
  ExportApplicationsQuery,
} from "./application.schema.js";

const LIST_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  nationality: true,
  email: true,
  programLevel: true,
  programLevelOther: true,
  programAppliedFor: true,
  intendedIntake: true,
  status: true,
  submittedAt: true,
  // Office record columns the admin list shows at a glance.
  rollNumber: true,
  facultyAdvisor: true,
  visaExpiryDate: true,
  exitDate: true,
} satisfies Prisma.StudentApplicationSelect;

function buildWhere(
  query: ListApplicationsQuery | ExportApplicationsQuery,
): Prisma.StudentApplicationWhereInput {
  return {
    ...(query.status && { status: query.status }),
    ...(query.nationality && {
      nationality: { contains: query.nationality, mode: "insensitive" },
    }),
    ...(query.programLevel && { programLevel: query.programLevel }),
    ...(query.search && {
      OR: [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ],
    }),
  };
}

export async function findAllApplications(query: ListApplicationsQuery) {
  const where = buildWhere(query);

  const [applications, total] = await Promise.all([
    prisma.studentApplication.findMany({
      where,
      select: LIST_SELECT,
      orderBy: { submittedAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.studentApplication.count({ where }),
  ]);

  return { applications, total, page: query.page, limit: query.limit };
}

/** Full rows for the spreadsheet export — every column the register needs. */
export const findApplicationsForExport = (query: ExportApplicationsQuery) =>
  prisma.studentApplication.findMany({
    where: buildWhere(query),
    orderBy: { submittedAt: "asc" },
  });

export const findApplicationById = (id: string) =>
  prisma.studentApplication.findUnique({ where: { id } });

export const createApplication = (
  data: CreateApplicationInput & { documentPaths: Record<string, string> },
) => {
  const { documentPaths, ...rest } = data;
  return prisma.studentApplication.create({
    data: {
      ...rest,
      passportCopyPath: documentPaths.passportCopy,
      photoPath: documentPaths.photo,
      academicTranscriptsPath: documentPaths.academicTranscripts,
      englishTestScoreCardPath: documentPaths.englishTestScoreCard,
      statementOfPurposePath: documentPaths.statementOfPurpose,
      financialProofPath: documentPaths.financialProof,
      recommendationLetterPath: documentPaths.recommendationLetter,
    },
  });
};

export const updateApplicationStatus = (
  id: string,
  data: UpdateApplicationStatusInput,
  reviewedByAdminId: string,
) =>
  prisma.studentApplication.update({
    where: { id },
    data: { ...data, reviewedByAdminId },
  });

export const updateApplicationRecord = (id: string, data: UpdateApplicationRecordInput) =>
  prisma.studentApplication.update({ where: { id }, data });

export const deleteApplication = (id: string) =>
  prisma.studentApplication.delete({ where: { id } });
