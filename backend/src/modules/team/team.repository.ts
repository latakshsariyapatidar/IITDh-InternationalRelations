import { prisma } from "../../config/prisma.js";
import type {
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
  ListTeamQuery,
} from "./team.schema.js";

export async function findAllTeamMembers(query: ListTeamQuery) {
  const where =
    query.isActive !== undefined ? { isActive: query.isActive } : {};
  const [team, total] = await Promise.all([
    prisma.iROTeamMember.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.iROTeamMember.count({ where }),
  ]);
  return { team, total, page: query.page, limit: query.limit };
}

export const findTeamMemberById = (id: string) =>
  prisma.iROTeamMember.findUnique({ where: { id } });
export const createTeamMember = (data: CreateTeamMemberInput) =>
  prisma.iROTeamMember.create({ data });
export const updateTeamMember = (id: string, data: UpdateTeamMemberInput) =>
  prisma.iROTeamMember.update({ where: { id }, data });
export const deleteTeamMember = (id: string) =>
  prisma.iROTeamMember.delete({ where: { id } });
