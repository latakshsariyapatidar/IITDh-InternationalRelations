import { prisma } from "../../config/prisma.js";
import type {
  CreatePartnerInput,
  UpdatePartnerInput,
  ListPartnersQuery,
} from "./partner.schema.js";

export async function findAllPartners(query: ListPartnersQuery) {
  const where = {
    ...(query.type && { type: query.type }),
    ...(query.isActive !== undefined && { isActive: query.isActive }),
  };

  const [partners, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: [{ type: "asc" }, { name: "asc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.partner.count({ where }),
  ]);

  return { partners, total, page: query.page, limit: query.limit };
}

export const findPartnerById = (id: string) =>
  prisma.partner.findUnique({ where: { id } });
export const createPartner = (data: CreatePartnerInput) =>
  prisma.partner.create({ data });
export const updatePartner = (id: string, data: UpdatePartnerInput) =>
  prisma.partner.update({ where: { id }, data });
export const deletePartner = (id: string) =>
  prisma.partner.delete({ where: { id } });
