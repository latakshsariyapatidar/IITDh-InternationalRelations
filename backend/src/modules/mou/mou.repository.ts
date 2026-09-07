import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { CreateMouInput, UpdateMouInput, ListMousQuery } from "./mou.schema.js";

// `documentPath` never leaves the repository in a public shape — listings
// expose `hasDocument` instead, and the file itself comes from the
// authenticated download route.
const PUBLIC_SELECT = {
  id: true,
  partnerId: true,
  title: true,
  signedDate: true,
  expiryDate: true,
  status: true,
  scope: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MouSelect;

export async function findAllMous(query: ListMousQuery) {
  const where: Prisma.MouWhereInput = {
    ...(query.partnerId && { partnerId: query.partnerId }),
    ...(query.status && { status: query.status }),
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
      select: {
        ...PUBLIC_SELECT,
        documentPath: true,
        partner: { select: { name: true, country: true, countryCode: true, logoUrl: true } },
      },
    }),
    prisma.mou.count({ where }),
  ]);

  return { mous, total, page: query.page, limit: query.limit };
}

export const findMouById = (id: string) =>
  prisma.mou.findUnique({
    where: { id },
    select: { ...PUBLIC_SELECT, documentPath: true, partner: true },
  });

export const createMou = (data: CreateMouInput) => prisma.mou.create({ data });
export const updateMou = (id: string, data: UpdateMouInput) =>
  prisma.mou.update({ where: { id }, data });
export const setMouDocumentPath = (id: string, documentPath: string) =>
  prisma.mou.update({ where: { id }, data: { documentPath } });
export const deleteMou = (id: string) => prisma.mou.delete({ where: { id } });
