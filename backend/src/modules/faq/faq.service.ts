import * as repo from "./faq.repository.js";
import AppError from "../../shared/utils/appError.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
import type {
  CreateFAQInput,
  UpdateFAQInput,
  ListFAQsQuery,
} from "./faq.schema.js";

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route. It is the only
 * thing that widens the result set beyond what is publicly visible, and it
 * defaults to the safe side everywhere it is inferred.
 */
export const getAll = (q: ListFAQsQuery, isAdmin: boolean) =>
  repo.findAllFAQs(q, isAdmin);

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findFAQById(id);

  // A hidden row is a 404, not a 403: an anonymous caller has no business
  // learning that the id exists.
  if (!item || !canSeeRecord(item, "isActive", isAdmin)) {
    throw AppError.notFound("FAQ not found");
  }

  return item;
}

export const create = (data: CreateFAQInput) => repo.createFAQ(data);
export async function update(id: string, data: UpdateFAQInput) {
  await getById(id);
  return repo.updateFAQ(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteFAQ(id);
}
