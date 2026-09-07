import * as repo from "./partner.repository.js";
import AppError from "../../shared/utils/appError.js";
import { toCountryCode } from "../../shared/utils/country.js";
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

/**
 * Fills in the flag code from the country name so admins never have to know
 * ISO codes. An explicitly supplied code always wins; `fallbackCountry` is the
 * country already on the record, so editing a partner that predates this
 * column fills its code in without the admin having to retype the country.
 */
function withDerivedCountryCode<T extends { country?: string; countryCode?: string }>(
  data: T,
  fallbackCountry?: string,
): T {
  if (data.countryCode) return data;

  const countryCode = toCountryCode(data.country ?? fallbackCountry);
  return countryCode ? { ...data, countryCode } : data;
}

export const create = (data: CreatePartnerInput) =>
  repo.createPartner(withDerivedCountryCode(data));

export async function update(id: string, data: UpdatePartnerInput) {
  const existing = await getById(id);
  return repo.updatePartner(id, withDerivedCountryCode(data, existing.country));
}
export async function remove(id: string) {
  await getById(id);
  return repo.deletePartner(id);
}
