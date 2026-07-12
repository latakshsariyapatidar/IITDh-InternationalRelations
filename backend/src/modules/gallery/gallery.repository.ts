import { prisma } from "../../config/prisma.js";
import type {
  CreateGalleryImageInput,
  UpdateGalleryImageInput,
  ListGalleryQuery,
} from "./gallery.schema.js";

export async function findAllImages(query: ListGalleryQuery) {
  const where = {
    ...(query.category && { category: query.category }),
    ...(query.isPublic !== undefined && { isPublic: query.isPublic }),
  };

  const [images, total] = await Promise.all([
    prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.galleryImage.count({ where }),
  ]);

  return { images, total, page: query.page, limit: query.limit };
}

export const findImageById = (id: string) =>
  prisma.galleryImage.findUnique({ where: { id } });
export const createImage = (data: CreateGalleryImageInput) =>
  prisma.galleryImage.create({ data });
export const updateImage = (id: string, data: UpdateGalleryImageInput) =>
  prisma.galleryImage.update({ where: { id }, data });
export const deleteImage = (id: string) =>
  prisma.galleryImage.delete({ where: { id } });
