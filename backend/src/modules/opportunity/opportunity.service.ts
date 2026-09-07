import * as repo from "./opportunity.repository.js";
import AppError from "../../shared/utils/appError.js";
import { toCountryCode } from "../../shared/utils/country.js";
import { isVisibleNow } from "../../shared/utils/visibility.js";
import type {
  CreateOpportunityInput,
  UpdateOpportunityInput,
  ListOpportunitiesQuery,
} from "./opportunity.schema.js";

/**
 * `isAdmin` decides how much is visible: the public sees only postings inside
 * their visibility window, admins see everything so they can manage drafts and
 * expired items.
 */
export const getAll = (query: ListOpportunitiesQuery, isAdmin: boolean) =>
  repo.findAllOpportunities(query, {
    liveOnly: !isAdmin || query.includeExpired === false,
  });

export const getFeed = (role: "STUDENT" | "FACULTY", limit: number) =>
  repo.findOpportunityFeed(role, limit);

export async function getById(id: string, isAdmin: boolean) {
  const item = await repo.findOpportunityById(id);
  if (!item) throw AppError.notFound("Opportunity not found");

  // A posting outside its window is a 404 to the public, not a peek at a draft.
  if (!isAdmin && !isVisibleNow(item)) {
    throw AppError.notFound("Opportunity not found");
  }

  return item;
}

const withDerivedCountryCode = <T extends { country?: string | null; countryCode?: string | null }>(
  data: T,
): T => ({
  ...data,
  ...(data.countryCode ? {} : { countryCode: toCountryCode(data.country) }),
});

export const create = (data: CreateOpportunityInput) =>
  repo.createOpportunity(withDerivedCountryCode(data));

export async function update(id: string, data: UpdateOpportunityInput) {
  await getById(id, true);
  return repo.updateOpportunity(id, withDerivedCountryCode(data));
}

export async function remove(id: string) {
  await getById(id, true);
  return repo.deleteOpportunity(id);
}
