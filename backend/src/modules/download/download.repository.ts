import { prisma } from "../../config/prisma.js";
import type {
  CreateDownloadInput,
  UpdateDownloadInput,
  ListDownloadsQuery,
} from "./download.schema.js";

export async function findAllDownloads(query: ListDownloadsQuery) {
  const where = {
    ...(query.category && { category: query.category }),
    ...(query.isPublic !== undefined && { isPublic: query.isPublic }),
  };

  const [downloads, total] = await Promise.all([
    prisma.download.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.download.count({ where }),
  ]);

  return { downloads, total, page: query.page, limit: query.limit };
}

export const findDownloadById = (id: string) =>
  prisma.download.findUnique({ where: { id } });
export const createDownload = (data: CreateDownloadInput) =>
  prisma.download.create({ data });
export const updateDownload = (id: string, data: UpdateDownloadInput) =>
  prisma.download.update({ where: { id }, data });
export const deleteDownload = (id: string) =>
  prisma.download.delete({ where: { id } });
