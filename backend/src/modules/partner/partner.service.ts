import * as repo from "./partner.repository.js";
import AppError from "../../shared/utils/appError.js";
import { toCountryCode } from "../../shared/utils/country.js";
import { canSeeRecord } from "../../shared/utils/visibility.js";
import { removeAllForPartner } from "../mou/mou.service.js";
import type {
  CreatePartnerInput,
  UpdatePartnerInput,
  ListPartnersQuery,
} from "./partner.schema.js";

/**
 * `isAdmin` comes from `optionalAuthenticate` on the route and is the only
 * thing that reveals deactivated partners.
 */
export const getAll = (q: ListPartnersQuery, isAdmin: boolean) =>
  repo.findAllPartners(q, isAdmin);

export async function getById(id: string, isAdmin = true) {
  const item = await repo.findPartnerById(id, isAdmin);

  // A deactivated partner is a 404 to the public, not a 403.
  if (!item || !canSeeRecord(item, "isActive", isAdmin)) {
    throw AppError.notFound("Partner not found");
  }

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

  // Explicit, in this order, because the Mou.partner relation is Restrict:
  // the delete below fails outright while any MOU still references this row.
  // That is deliberate — it is what forces the cascade through the MOU
  // service, which deletes each signed PDF as it goes.
  //
  // Outbound applications are Restrict too but are NOT cleaned up here: an
  // application is a student's record, not the partner's, so deleting a
  // partner that has any is refused with a 409 rather than quietly destroying
  // them.
  await removeAllForPartner(id);

  return repo.deletePartner(id);
}
