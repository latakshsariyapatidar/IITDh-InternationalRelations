import * as repo from "./gallery.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateGalleryImageInput,
  UpdateGalleryImageInput,
  ListGalleryQuery,
} from "./gallery.schema.js";

export const getAll = (q: ListGalleryQuery) => repo.findAllImages(q);

export async function getById(id: string) {
  const item = await repo.findImageById(id);
  if (!item) throw AppError.notFound("Gallery image not found");
  return item;
}

export const create = (data: CreateGalleryImageInput) => repo.createImage(data);
export async function update(id: string, data: UpdateGalleryImageInput) {
  await getById(id);
  return repo.updateImage(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteImage(id);
}
