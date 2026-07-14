import * as repo from "./download.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateDownloadInput,
  UpdateDownloadInput,
  ListDownloadsQuery,
} from "./download.schema.js";

export const getAll = (q: ListDownloadsQuery) => repo.findAllDownloads(q);

export async function getById(id: string) {
  const item = await repo.findDownloadById(id);
  if (!item) throw AppError.notFound("Download not found");
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
