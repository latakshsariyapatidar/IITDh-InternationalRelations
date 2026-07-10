import * as repo from "./partner.repository.js";
import AppError from "../../shared/utils/appError.js";
import type {
  CreatePartnerInput,
  UpdatePartnerInput,
  ListPartnersQuery,
} from "./partner.schema.js";

export const getAll = (q: ListPartnersQuery) => repo.findAllPartners(q);

export async function getById(id: string) {
  const item = await repo.findPartnerById(id);
  if (!item) throw AppError.notFound("Partner not found");
  return item;
}

export const create = (data: CreatePartnerInput) => repo.createPartner(data);
export async function update(id: string, data: UpdatePartnerInput) {
  await getById(id);
  return repo.updatePartner(id, data);
}
export async function remove(id: string) {
  await getById(id);
  return repo.deletePartner(id);
}
