import * as repo from "./announcement.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  ListAnnouncementsQuery,
} from "./announcement.schema.js";

export const getAll = (query: ListAnnouncementsQuery) =>
  repo.findAllAnnouncements(query);

export async function getById(id: string) {
  const item = await repo.findAnnouncementById(id);
  if (!item) throw AppError.notFound("Announcement not found");
  return item;
}

export const create = (data: CreateAnnouncementInput) =>
  repo.createAnnouncement(data);

export async function update(id: string, data: UpdateAnnouncementInput) {
  await getById(id);
  return repo.updateAnnouncement(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.deleteAnnouncement(id);
}
