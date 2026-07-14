import { prisma } from "../../config/prisma.js";
import type {
  CreateFAQInput,
  UpdateFAQInput,
  ListFAQsQuery,
} from "./faq.schema.js";

export async function findAllFAQs(query: ListFAQsQuery) {
  const where =
    query.isActive !== undefined ? { isActive: query.isActive } : {};
  const [faqs, total] = await Promise.all([
    prisma.fAQ.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.fAQ.count({ where }),
  ]);
  return { faqs, total, page: query.page, limit: query.limit };
}

export const findFAQById = (id: string) =>
  prisma.fAQ.findUnique({ where: { id } });
export const createFAQ = (data: CreateFAQInput) => prisma.fAQ.create({ data });
export const updateFAQ = (id: string, data: UpdateFAQInput) =>
  prisma.fAQ.update({ where: { id }, data });
export const deleteFAQ = (id: string) => prisma.fAQ.delete({ where: { id } });
