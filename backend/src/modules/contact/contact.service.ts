import * as repo from "./contact.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateContactInput,
  UpdateContactInput,
  ListContactsQuery,
} from "./contact.schema.js";

export const getAll = (q: ListContactsQuery) => repo.findAllContacts(q);

export async function getById(id: string) {
  const item = await repo.findContactById(id);
  if (!item) throw AppError.notFound("Contact not found");
  return item;
}

export const create = (data: CreateContactInput) => repo.createContact(data);
export async function update(id: string, data: UpdateContactInput) {
  await getById(id);
  return repo.updateContact(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteContact(id);
}
