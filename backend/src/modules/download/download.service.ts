import * as repo from "./download.repository.js";
import AppError from "../../shared/utils/appError.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
import type {
  CreateDownloadInput,
  UpdateDownloadInput,
  ListDownloadsQuery,
} from "./download.schema.js";

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route. It is the only
 * thing that widens the result set beyond what is publicly visible, and it
 * defaults to the safe side everywhere it is inferred.
 */
export const getAll = (q: ListDownloadsQuery, isAdmin: boolean) =>
  repo.findAllDownloads(q, isAdmin);

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findDownloadById(id);

  // A hidden row is a 404, not a 403: an anonymous caller has no business
  // learning that the id exists.
  if (!item || !canSeeRecord(item, "isPublic", isAdmin)) {
    throw AppError.notFound("Download not found");
  }

  return item;
}

export const create = (data: CreateDownloadInput) => repo.createDownload(data);
export async function update(id: string, data: UpdateDownloadInput) {
  await getById(id);
  return repo.updateDownload(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteDownload(id);
}
