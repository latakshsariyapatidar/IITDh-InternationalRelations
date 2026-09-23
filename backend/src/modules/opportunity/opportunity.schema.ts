import { z } from "zod";
import {
  clearableHttpUrl,
  clearableHttpUrlOrPath,
  httpUrl,
  httpUrlOrPath,
  normaliseUrlInput,
  queryBoolean,
} from "../../shared/utils/zodHelpers.js";

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

// Was a local helper that prefixed "https://" onto anything without it —
// including "javascript:alert(1)", which already has a scheme and so was left
// alone and then accepted by z.string().url(). normaliseUrlInput does the same
// convenience job but hands anything already carrying a scheme straight to
// httpUrl, which only admits http and https.
const urlPreprocess = normaliseUrlInput;

export const createOpportunitySchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(300),
    description: z.string().trim().min(1, "Description is required"),
    // Who the posting is for. Admin picks this on upload; every listing filters
    // on it so students never see faculty-only postings and vice versa.
    audience: OpportunityAudienceEnum,
    category: OpportunityCategoryEnum.default("OTHER"),
    organisation: z.string().trim().max(300).nullish(),
    country: z.string().trim().max(100).nullish(),
    countryCode: z.string().trim().length(2).toUpperCase().nullish(),
    externalUrl: clearableHttpUrl(),
    url: clearableHttpUrl(),
    // Had no scheme check at all, and the faculty portal renders it as an
    // href. It holds either an uploaded "/uploads/opportunities/<file>" path
    // or an external link, so it accepts both and nothing else.
    attachmentUrl: clearableHttpUrlOrPath(),
    applicationDeadline: z.coerce.date().nullish(),
    publishedAt: z.coerce.date().nullish(),
    visibleUntil: z.coerce.date().nullish(),
    isActive: z.boolean().default(true),
  })
  .transform(({ url, ...data }) => ({
    ...data,
    ...(url !== undefined && !data.externalUrl ? { externalUrl: url } : {}),
  }));

export const updateOpportunitySchema = z
  .object({
    title: z.string().trim().min(1).max(300).optional(),
    description: z.string().trim().min(1).optional(),
    audience: OpportunityAudienceEnum.optional(),
    category: OpportunityCategoryEnum.optional(),
    organisation: z.string().trim().max(300).nullish(),
    country: z.string().trim().max(100).nullish(),
    countryCode: z.string().trim().length(2).toUpperCase().nullish(),
    externalUrl: clearableHttpUrl(),
    url: clearableHttpUrl(),
    // Had no scheme check at all, and the faculty portal renders it as an
    // href. It holds either an uploaded "/uploads/opportunities/<file>" path
    // or an external link, so it accepts both and nothing else.
    attachmentUrl: clearableHttpUrlOrPath(),
    applicationDeadline: z.coerce.date().nullish(),
    publishedAt: z.coerce.date().nullish(),
    visibleUntil: z.coerce.date().nullish(),
    isActive: z.boolean().optional(),
  })
  .transform(({ url, ...data }) => ({
    ...data,
    ...(url !== undefined && data.externalUrl === undefined ? { externalUrl: url } : {}),
  }));

export const opportunityIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export const listOpportunitiesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  audience: OpportunityAudienceEnum.optional(),
  category: OpportunityCategoryEnum.optional(),
  // Admin-only: include postings outside their visibility window. Ignored for
  // anonymous callers, who only ever see what is currently live.
  includeExpired: queryBoolean(),
});

export const opportunityFeedSchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
export type ListOpportunitiesQuery = z.infer<typeof listOpportunitiesSchema>;
export type OpportunityFeedQuery = z.infer<typeof opportunityFeedSchema>;
