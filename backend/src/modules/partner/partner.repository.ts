import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import type {
  CreatePartnerInput,
  UpdatePartnerInput,
  ListPartnersQuery,
} from "./partner.schema.js";

const ORDER_BY: Record<
  ListPartnersQuery["sortBy"],
  Prisma.PartnerOrderByWithRelationInput[]
> = {
  country: [{ country: "asc" }, { name: "asc" }],
  name: [{ name: "asc" }],
  type: [{ type: "asc" }, { name: "asc" }],
};

export async function findAllPartners(query: ListPartnersQuery) {
  const where: Prisma.PartnerWhereInput = {
    ...(query.type && { type: query.type }),
    ...(query.country && { country: { contains: query.country, mode: "insensitive" } }),
    ...(query.isActive !== undefined && { isActive: query.isActive }),
  };

  const [partners, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: ORDER_BY[query.sortBy],
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
