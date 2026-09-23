import * as repo from "./program.repository.js";
import AppError from "../../shared/utils/appError.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
import type {
  CreateProgramInput,
  UpdateProgramInput,
  ListProgramsQuery,
} from "./program.schema.js";

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route. It is the only
 * thing that widens the result set beyond what is publicly visible, and it
 * defaults to the safe side everywhere it is inferred.
 */
export const getAll = (q: ListProgramsQuery, isAdmin: boolean) =>
  repo.findAllPrograms(q, isAdmin);

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findProgramById(id);

  // A hidden row is a 404, not a 403: an anonymous caller has no business
  // learning that the id exists.
  if (!item || !canSeeRecord(item, "isActive", isAdmin)) {
    throw AppError.notFound("Program not found");
  }

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
