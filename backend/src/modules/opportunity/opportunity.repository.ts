import { prisma } from "../../config/prisma.js";
import type { Prisma } from "@prisma/client";
import { visibilityWindowWhere } from "../../shared/utils/visibility.js";
import type { CreateOpportunityInput, UpdateOpportunityInput, ListOpportunitiesQuery } from "./opportunity.schema.js";

type Audience = "STUDENT" | "FACULTY";

/**
 * Postings a given role should see: their own audience plus the ones marked for
 * everybody. Admin listings pass no role and see all.
 */
export const audienceWhere = (role?: Audience): Prisma.OpportunityWhereInput =>
  role ? { audience: { in: [role, "BOTH"] } } : {};

export async function findAllOpportunities(
  query: ListOpportunitiesQuery,
  { liveOnly }: { liveOnly: boolean },
) {
  const where: Prisma.OpportunityWhereInput = {
    ...(query.audience && { audience: query.audience }),
    ...(query.category && { category: query.category }),
    ...(liveOnly && { isActive: true, ...visibilityWindowWhere() }),
  };

  const [opportunities, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      // Soonest deadline first; postings without one fall to the back.
      orderBy: [{ applicationDeadline: "asc" }, { createdAt: "desc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.opportunity.count({ where }),
  ]);

  return { opportunities, total, page: query.page, limit: query.limit };
}

/** Latest live postings for one role — the portal "latest opportunities" list. */
export const findOpportunityFeed = (role: Audience, limit: number) =>
  prisma.opportunity.findMany({
    where: { isActive: true, ...audienceWhere(role), ...visibilityWindowWhere() },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

export const findOpportunityById = (id: string) =>
  prisma.opportunity.findUnique({ where: { id } });

export const createOpportunity = (data: CreateOpportunityInput) =>
  prisma.opportunity.create({ data });

export const updateOpportunity = (id: string, data: UpdateOpportunityInput) =>
  prisma.opportunity.update({ where: { id }, data });

export const deleteOpportunity = (id: string) =>
  prisma.opportunity.delete({ where: { id } });
