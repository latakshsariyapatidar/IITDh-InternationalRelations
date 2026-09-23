import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { visibilityFlagWhere } from "../../shared/utils/visibility.js";
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

// A partner carries its MOUs, and an MOU has its own `isPublic` flag, so the
// nested read needs the same gate as a direct one — otherwise a non-public
// agreement leaks out through the partners listing instead of /mous.
const mouSelect = (isAdmin: boolean) => ({
  where: isAdmin ? {} : { isPublic: true },
  select: {
    id: true,
    title: true,
    signedDate: true,
    expiryDate: true,
    status: true,
    scope: true,
    documentPath: true,
  },
});

export async function findAllPartners(query: ListPartnersQuery, isAdmin: boolean) {
  const where: Prisma.PartnerWhereInput = {
    ...(query.type && { type: query.type }),
    ...(query.country && { country: { contains: query.country, mode: "insensitive" } }),
    ...visibilityFlagWhere("isActive", isAdmin, query.isActive),
  };

  const [partners, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: ORDER_BY[query.sortBy],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { mous: mouSelect(isAdmin) },
    }),
    prisma.partner.count({ where }),
  ]);

  return {
    partners: partners.map((p) => ({
      ...p,
      mous: p.mous.map(({ documentPath, ...mou }) => ({
        ...mou,
        hasDocument: documentPath !== null,
      })),
    })),
    total,
    page: query.page,
    limit: query.limit,
  };
}

export const findPartnerById = async (id: string, isAdmin = true) => {
  const p = await prisma.partner.findUnique({
    where: { id },
    include: { mous: mouSelect(isAdmin) },
  });
  if (!p) return null;
  const { mous, ...partner } = p;
  return {
    ...partner,
    mous: mous.map(({ documentPath, ...mou }) => ({
      ...mou,
      hasDocument: documentPath !== null,
    })),
  };
};
export const createPartner = (data: CreatePartnerInput) =>
  prisma.partner.create({ data });
export const updatePartner = (id: string, data: UpdatePartnerInput) =>
  prisma.partner.update({ where: { id }, data });
export const deletePartner = (id: string) =>
  prisma.partner.delete({ where: { id } });
