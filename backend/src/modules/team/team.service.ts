import * as repo from "./team.repository.js";
import AppError from "../../shared/utils/appError.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
import type {
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
  ListTeamQuery,
} from "./team.schema.js";

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route. It is the only
 * thing that widens the result set beyond what is publicly visible, and it
 * defaults to the safe side everywhere it is inferred.
 */
export const getAll = (q: ListTeamQuery, isAdmin: boolean) =>
  repo.findAllTeamMembers(q, isAdmin);

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findTeamMemberById(id);

  // A hidden row is a 404, not a 403: an anonymous caller has no business
  // learning that the id exists.
  if (!item || !canSeeRecord(item, "isActive", isAdmin)) {
    throw AppError.notFound("Team member not found");
  }

  return item;
}

export const create = (data: CreateTeamMemberInput) =>
  repo.createTeamMember(data);
export async function update(id: string, data: UpdateTeamMemberInput) {
  await getById(id);
  return repo.updateTeamMember(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deleteTeamMember(id);
}
