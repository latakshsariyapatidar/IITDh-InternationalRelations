import * as repo from "./faculty.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateFacultyInput,
  UpdateFacultyInput,
  ListFacultyQuery,
} from "./faculty.schema.js";

export const getAll = (q: ListFacultyQuery) => repo.findAllFaculty(q);

export async function getById(id: string) {
  const item = await repo.findFacultyById(id);
  if (!item) throw AppError.notFound("Faculty member not found");
  return item;
}

export const create = (data: CreateFacultyInput) => repo.createFaculty(data);
export async function update(id: string, data: UpdateFacultyInput) {
  await getById(id);
  return repo.updateFaculty(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteFaculty(id);
}
