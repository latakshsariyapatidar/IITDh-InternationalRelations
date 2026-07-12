import * as repo from "./program.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateProgramInput,
  UpdateProgramInput,
  ListProgramsQuery,
} from "./program.schema.js";

export const getAll = (q: ListProgramsQuery) => repo.findAllPrograms(q);

export async function getById(id: string) {
  const item = await repo.findProgramById(id);
  if (!item) throw AppError.notFound("Program not found");
  return item;
}

export const create = (data: CreateProgramInput) => repo.createProgram(data);
export async function update(id: string, data: UpdateProgramInput) {
  await getById(id);
  return repo.updateProgram(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteProgram(id);
}
