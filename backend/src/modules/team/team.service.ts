import * as repo from "./team.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
  ListTeamQuery,
} from "./team.schema.js";

export const getAll = (q: ListTeamQuery) => repo.findAllTeamMembers(q);

export async function getById(id: string) {
  const item = await repo.findTeamMemberById(id);
  if (!item) throw AppError.notFound("Team member not found");
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
