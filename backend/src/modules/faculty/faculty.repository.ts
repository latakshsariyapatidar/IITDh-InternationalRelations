import { prisma } from "../../config/prisma.js";
import type {
  CreateFacultyInput,
  UpdateFacultyInput,
  ListFacultyQuery,
} from "./faculty.schema.js";

export async function findAllFaculty(query: ListFacultyQuery) {
  const where = {
    ...(query.isActive !== undefined && { isActive: query.isActive }),
  };

  const [faculty, total] = await Promise.all([
    prisma.faculty.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.faculty.count({ where }),
  ]);

  return { faculty, total, page: query.page, limit: query.limit };
}

export const findFacultyById = (id: string) =>
  prisma.faculty.findUnique({ where: { id } });
export const createFaculty = (data: CreateFacultyInput) =>
  prisma.faculty.create({ data });
export const updateFaculty = (id: string, data: UpdateFacultyInput) =>
  prisma.faculty.update({ where: { id }, data });
export const deleteFaculty = (id: string) =>
  prisma.faculty.delete({ where: { id } });
