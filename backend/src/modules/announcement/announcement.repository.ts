import { prisma } from "../../config/prisma.js";
import type {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  ListAnnouncementsQuery,
} from "./announcement.schema.js";

export async function findAllAnnouncements(query: ListAnnouncementsQuery) {
  const { page, limit, isPublic } = query;
  const where = isPublic !== undefined ? { isPublic } : {};

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
