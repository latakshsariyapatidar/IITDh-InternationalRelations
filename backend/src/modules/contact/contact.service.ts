import * as repo from "./contact.repository.js";
import AppError from "../../shared/utils/appError.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
import type {
  CreateContactInput,
  UpdateContactInput,
  ListContactsQuery,
} from "./contact.schema.js";

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route. It is the only
 * thing that widens the result set beyond what is publicly visible, and it
 * defaults to the safe side everywhere it is inferred.
 */
export const getAll = (q: ListContactsQuery, isAdmin: boolean) =>
  repo.findAllContacts(q, isAdmin);

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findContactById(id);

  // A hidden row is a 404, not a 403: an anonymous caller has no business
  // learning that the id exists.
  if (!item || !canSeeRecord(item, "isActive", isAdmin)) {
    throw AppError.notFound("Contact not found");
  }

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
