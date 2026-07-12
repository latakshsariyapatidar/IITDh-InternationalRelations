import * as repo from "./faq.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateFAQInput,
  UpdateFAQInput,
  ListFAQsQuery,
} from "./faq.schema.js";

export const getAll = (q: ListFAQsQuery) => repo.findAllFAQs(q);

export async function getById(id: string) {
  const item = await repo.findFAQById(id);
  if (!item) throw AppError.notFound("FAQ not found");
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
