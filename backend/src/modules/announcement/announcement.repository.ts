import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { visibilityWindowWhere } from "../../shared/utils/visibility.js";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  ListAnnouncementsQuery,
} from "./announcement.schema.js";

export async function findAllAnnouncements(
  query: ListAnnouncementsQuery,
  { liveOnly }: { liveOnly: boolean },
) {
  const { page, limit, isPublic } = query;

  const where: Prisma.AnnouncementWhereInput = {
    ...(isPublic !== undefined && { isPublic }),
    // Public callers see only announcements between their publish date and
    // their visibility date.
    ...(liveOnly && { isPublic: true, ...visibilityWindowWhere() }),
  };

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        isPublic: true,
        publishedAt: true,
        visibleUntil: true,
        createdAt: true,
      },
    }),
    prisma.announcement.count({ where }),
  ]);

  return { announcements, total, page, limit };
}

export const findAnnouncementById = (id: string) =>
  prisma.announcement.findUnique({ where: { id } });
export const createAnnouncement = (data: CreateAnnouncementInput) =>
  prisma.announcement.create({ data });
export const updateAnnouncement = (id: string, data: UpdateAnnouncementInput) =>
  prisma.announcement.update({ where: { id }, data });
export const deleteAnnouncement = (id: string) =>
  prisma.announcement.delete({ where: { id } });
