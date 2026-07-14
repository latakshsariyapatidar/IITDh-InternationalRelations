import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { CreateMouInput, UpdateMouInput, ListMousQuery } from "./mou.schema.js";

export async function findAllMous(query: ListMousQuery) {
  const where: Prisma.MouWhereInput = {
    ...(query.partnerId && { partnerId: query.partnerId }),
    ...(query.status && { status: query.status }),
    ...(query.isPublic !== undefined && { isPublic: query.isPublic }),
    ...(query.expiringWithinDays !== undefined && {
      expiryDate: {
        gte: new Date(),
        lte: new Date(Date.now() + query.expiringWithinDays * 24 * 60 * 60 * 1000),
      },
    }),
  };

  const [mous, total] = await Promise.all([
    prisma.mou.findMany({
      where,
      orderBy: { signedDate: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { partner: { select: { name: true, country: true } } },
    }),
    prisma.mou.count({ where }),
  ]);

  return { mous, total, page: query.page, limit: query.limit };
}

export const findMouById = (id: string) =>
  prisma.mou.findUnique({ where: { id }, include: { partner: true } });
export const createMou = (data: CreateMouInput) => prisma.mou.create({ data });
export const updateMou = (id: string, data: UpdateMouInput) =>
  prisma.mou.update({ where: { id }, data });
export const deleteMou = (id: string) => prisma.mou.delete({ where: { id } });
