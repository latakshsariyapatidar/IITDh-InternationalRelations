import { prisma } from "../../config/prisma.js";
import type { ListSiteContentQuery } from "./site-content.schema.js";

export async function findAllSiteContent(query: ListSiteContentQuery) {
  const where = query.page ? { page: query.page } : {};
  return prisma.siteContent.findMany({ where, orderBy: [{ page: "asc" }, { label: "asc" }] });
}

export const findSiteContentByKey = (key: string) =>
  prisma.siteContent.findUnique({ where: { key } });

export const updateSiteContentByKey = (key: string, value: string) =>
  prisma.siteContent.update({ where: { key }, data: { value } });

export async function bulkUpdateSiteContent(updates: { key: string; value: string }[]) {
  return prisma.$transaction(
    updates.map(({ key, value }) => prisma.siteContent.update({ where: { key }, data: { value } })),
  );
}
