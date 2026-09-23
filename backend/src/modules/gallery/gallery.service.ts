import * as repo from "./gallery.repository.js";
import AppError from "../../shared/utils/appError.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
import type {
  CreateGalleryImageInput,
  UpdateGalleryImageInput,
  ListGalleryQuery,
} from "./gallery.schema.js";

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route. It is the only
 * thing that widens the result set beyond what is publicly visible, and it
 * defaults to the safe side everywhere it is inferred.
 */
export const getAll = (q: ListGalleryQuery, isAdmin: boolean) =>
  repo.findAllImages(q, isAdmin);

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findImageById(id);

  // A hidden row is a 404, not a 403: an anonymous caller has no business
  // learning that the id exists.
  if (!item || !canSeeRecord(item, "isPublic", isAdmin)) {
    throw AppError.notFound("Gallery image not found");
  }

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
