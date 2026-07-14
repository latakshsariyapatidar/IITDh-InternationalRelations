import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type {
  CreateOutboundApplicationInput,
  UpdateOutboundApplicationStatusInput,
  ListOutboundApplicationsQuery,
} from "./outbound-application.schema.js";

const LIST_SELECT = {
  id: true,
  rollNumber: true,
  branch: true,
  programType: true,
  intendedSemester: true,
  status: true,
  submittedAt: true,
  student: { select: { name: true, email: true } },
  partner: { select: { name: true, country: true } },
} satisfies Prisma.OutboundApplicationSelect;

export async function findAllOutboundApplications(query: ListOutboundApplicationsQuery) {
  const where: Prisma.OutboundApplicationWhereInput = {
    ...(query.status && { status: query.status }),
    ...(query.partnerId && { partnerId: query.partnerId }),
  };

  const [applications, total] = await Promise.all([
    prisma.outboundApplication.findMany({
      where,
      select: LIST_SELECT,
      orderBy: { submittedAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.outboundApplication.count({ where }),
  ]);

  return { applications, total, page: query.page, limit: query.limit };
}

export async function findOutboundApplicationsForStudent(studentId: string) {
  return prisma.outboundApplication.findMany({
    where: { studentId },
    orderBy: { submittedAt: "desc" },
    include: { partner: { select: { name: true, country: true } } },
  });
}

export const findOutboundApplicationById = (id: string) =>
  prisma.outboundApplication.findUnique({
    where: { id },
    include: { partner: true, student: { select: { name: true, email: true } } },
  });

export const createOutboundApplication = (
  data: CreateOutboundApplicationInput & { studentId: string; documentPaths: Record<string, string> },
) => {
  const { documentPaths, ...rest } = data;
  return prisma.outboundApplication.create({
    data: {
      ...rest,
      statementOfPurposePath: documentPaths.statementOfPurpose,
      transcriptPath: documentPaths.transcript,
      recommendationLetterPath: documentPaths.recommendationLetter,
    },
  });
};

export const updateOutboundApplicationStatus = (
  id: string,
  data: UpdateOutboundApplicationStatusInput,
  reviewedByAdminId: string,
) => prisma.outboundApplication.update({ where: { id }, data: { ...data, reviewedByAdminId } });
