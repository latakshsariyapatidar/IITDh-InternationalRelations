import { prisma } from "../../config/prisma.js";
import type {
  CreateProgramInput,
  UpdateProgramInput,
  ListProgramsQuery,
} from "./program.schema.js";

export async function findAllPrograms(query: ListProgramsQuery) {
  const where = {
    ...(query.level && { level: query.level }),
    ...(query.isActive !== undefined && { isActive: query.isActive }),
  };

  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      where,
      orderBy: [{ level: "asc" }, { name: "asc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.program.count({ where }),
  ]);

  return { programs, total, page: query.page, limit: query.limit };
}

export const findProgramById = (id: string) =>
  prisma.program.findUnique({ where: { id } });
export const createProgram = (data: CreateProgramInput) =>
  prisma.program.create({ data });
export const updateProgram = (id: string, data: UpdateProgramInput) =>
  prisma.program.update({ where: { id }, data });
export const deleteProgram = (id: string) =>
  prisma.program.delete({ where: { id } });
