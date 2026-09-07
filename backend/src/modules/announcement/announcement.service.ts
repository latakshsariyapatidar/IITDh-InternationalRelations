import * as repo from "./announcement.repository.js";
import AppError from "../../shared/utils/appError.js";
import { isVisibleNow } from "../../shared/utils/visibility.js";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  ListAnnouncementsQuery,
} from "./announcement.schema.js";

/**
 * `isAdmin` widens the result set: the public sees only announcements inside
 * their publish/visibility window, admins see every row so they can manage
 * scheduled and expired ones.
 */
export const getAll = (query: ListAnnouncementsQuery, isAdmin: boolean) =>
  repo.findAllAnnouncements(query, {
    liveOnly: !isAdmin || query.includeExpired === false,
  });

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findAnnouncementById(id);
  if (!item) throw AppError.notFound("Announcement not found");

  // Past its visibility date, an announcement is gone as far as the public is
  // concerned — not merely hidden from the list.
  if (!isAdmin && !(item.isPublic && isVisibleNow(item))) {
    throw AppError.notFound("Announcement not found");
  }

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
