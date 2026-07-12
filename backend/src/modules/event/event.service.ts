import * as repo from "./event.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateEventInput,
  UpdateEventInput,
  ListEventsQuery,
} from "./event.schema.js";

export const getAll = (q: ListEventsQuery) => repo.findAllEvents(q);

export async function getById(id: string) {
  const item = await repo.findEventById(id);
  if (!item) throw AppError.notFound("Event not found");
  return item;
}

export const create = (data: CreateEventInput) => repo.createEvent(data);
export async function update(id: string, data: UpdateEventInput) {
  await getById(id);
  return repo.updateEvent(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteEvent(id);
}
