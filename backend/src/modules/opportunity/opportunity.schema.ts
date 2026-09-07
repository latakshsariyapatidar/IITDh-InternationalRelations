import { z } from "zod";

const OpportunityAudienceEnum = z.enum(["STUDENT", "FACULTY", "BOTH"]);
const OpportunityCategoryEnum = z.enum([
  "SCHOLARSHIP",
  "EXCHANGE",
  "INTERNSHIP",
  "RESEARCH",
  "FELLOWSHIP",
  "CONFERENCE",
  "GRANT",
  "OTHER",
]);

export const createOpportunitySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  description: z.string().trim().min(1, "Description is required"),
  // Who the posting is for. Admin picks this on upload; every listing filters
  // on it so students never see faculty-only postings and vice versa.
  audience: OpportunityAudienceEnum,
  category: OpportunityCategoryEnum.default("OTHER"),
  organisation: z.string().trim().max(300).optional(),
  country: z.string().trim().max(100).optional(),
  countryCode: z.string().trim().length(2).toUpperCase().optional(),
  externalUrl: z.string().url("Must be a valid URL").max(500).optional(),
  attachmentUrl: z.string().trim().max(500).optional(),
  applicationDeadline: z.coerce.date().optional(),
  publishedAt: z.coerce.date().optional(),
  visibleUntil: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

export const updateOpportunitySchema = createOpportunitySchema.partial().extend({
  applicationDeadline: z.coerce.date().nullish(),
  publishedAt: z.coerce.date().nullish(),
  visibleUntil: z.coerce.date().nullish(),
});

export const opportunityIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export const listOpportunitiesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  audience: OpportunityAudienceEnum.optional(),
  category: OpportunityCategoryEnum.optional(),
  // Admin-only: include postings outside their visibility window. Ignored for
  // anonymous callers, who only ever see what is currently live.
  includeExpired: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export const opportunityFeedSchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
export type ListOpportunitiesQuery = z.infer<typeof listOpportunitiesSchema>;
export type OpportunityFeedQuery = z.infer<typeof opportunityFeedSchema>;
