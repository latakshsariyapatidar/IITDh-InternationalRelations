import { prisma } from "../../config/prisma.js";
import type {
  CreateEventInput,
  UpdateEventInput,
  ListEventsQuery,
} from "./event.schema.js";

export async function findAllEvents(query: ListEventsQuery) {
  const now = new Date();
  const where = {
    ...(query.type && { type: query.type }),
    ...(query.isPublic !== undefined && { isPublic: query.isPublic }),
    ...(query.upcoming === true && { startDate: { gte: now } }),
    ...(query.upcoming === false && { startDate: { lt: now } }),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { startDate: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total, page: query.page, limit: query.limit };
}

export const findEventById = (id: string) =>
  prisma.event.findUnique({ where: { id } });
export const createEvent = (data: CreateEventInput) =>
  prisma.event.create({ data });
export const updateEvent = (id: string, data: UpdateEventInput) =>
  prisma.event.update({ where: { id }, data });
export const deleteEvent = (id: string) =>
  prisma.event.delete({ where: { id } });
