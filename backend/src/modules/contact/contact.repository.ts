import { prisma } from "../../config/prisma.js";
import { visibilityFlagWhere } from "../../shared/utils/visibility.js";
import type {
  CreateContactInput,
  UpdateContactInput,
  ListContactsQuery,
} from "./contact.schema.js";

export async function findAllContacts(
  query: ListContactsQuery,
  isAdmin: boolean,
) {
  const where = visibilityFlagWhere("isActive", isAdmin, query.isActive);
  return prisma.contact.findMany({ where, orderBy: { type: "asc" } });
}

export const findContactById = (id: string) =>
  prisma.contact.findUnique({ where: { id } });
export const createContact = (data: CreateContactInput) =>
  prisma.contact.create({ data });
export const updateContact = (id: string, data: UpdateContactInput) =>
  prisma.contact.update({ where: { id }, data });
export const deleteContact = (id: string) =>
  prisma.contact.delete({ where: { id } });
