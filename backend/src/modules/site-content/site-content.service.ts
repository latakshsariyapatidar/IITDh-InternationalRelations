import * as repo from "./site-content.repository.js";
import AppError from "../../shared/utils/appError.js";
import { Prisma } from "@prisma/client";
import type { ListSiteContentQuery } from "./site-content.schema.js";

export const getAll = (query: ListSiteContentQuery) => repo.findAllSiteContent(query);

export async function getByKey(key: string) {
  const item = await repo.findSiteContentByKey(key);
  if (!item) throw AppError.notFound(`No site content found for key "${key}"`);
  return item;
}

export async function updateByKey(key: string, value: string) {
  await getByKey(key);
  return repo.updateSiteContentByKey(key, value);
}

export async function bulkUpdate(updates: { key: string; value: string }[]) {
  try {
    return await repo.bulkUpdateSiteContent(updates);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw AppError.badRequest("One or more of the submitted keys do not exist");
    }
    throw err;
  }
}
