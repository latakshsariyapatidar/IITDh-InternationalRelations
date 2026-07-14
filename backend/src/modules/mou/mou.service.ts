import * as repo from "./mou.repository.js";
import AppError from "../../shared/utils/appError.js";
import { findPartnerById } from "../partner/partner.repository.js";
import type { CreateMouInput, UpdateMouInput, ListMousQuery } from "./mou.schema.js";

export const getAll = (q: ListMousQuery) => repo.findAllMous(q);

export async function getById(id: string) {
  const item = await repo.findMouById(id);
  if (!item) throw AppError.notFound("MOU not found");
  return item;
}

export async function create(data: CreateMouInput) {
  const partner = await findPartnerById(data.partnerId);
  if (!partner) throw AppError.badRequest("Selected partner does not exist");
  return repo.createMou(data);
}

export async function update(id: string, data: UpdateMouInput) {
  await getById(id);
  return repo.updateMou(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.deleteMou(id);
}
