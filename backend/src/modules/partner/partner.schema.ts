import { z } from "zod";
import { PartnerType } from "@prisma/client";
import {
  clearableHttpUrl,
  clearableHttpUrlOrPath,
  httpUrl,
  httpUrlOrPath,
  normaliseUrlInput,
  partialForUpdate,
  prismaEnum,
  queryBoolean,
} from "../../shared/utils/zodHelpers.js";

// Derived from schema.prisma rather than typed out again. The hand-written
// copy listed only UNIVERSITY and ORGANIZATION while the database also holds
// CONSORTIUM and NETWORK, so the three consortium and network partners the
// seed creates could not be edited through the admin panel.
const PartnerTypeEnum = prismaEnum(PartnerType);

export const createPartnerSchema = z.object({
  name: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(100),
  // ISO 3166-1 alpha-2. Derived from `country` when omitted; the partners table
  // renders a flag from it.
  countryCode: z.string().trim().length(2).toUpperCase().optional(),
  type: PartnerTypeEnum,
  focus: z.string().trim().max(200).optional(),
  // httpUrl, not z.string().url(). Zod's url() only asks "does this parse",
  // and "javascript:alert(document.cookie)" parses — it is a valid URL with
  // the javascript scheme. The partners table renders this as an href, so a
  // parseable-but-executable value is stored XSS waiting for a click.
  website: clearableHttpUrl(),
  // Accepts an absolute http(s) URL or a site-relative path: logos uploaded
  // through POST /uploads/image/partners come back as
  // "/uploads/partners/<file>", which httpUrl() alone would reject.
  logoUrl: clearableHttpUrlOrPath(),
  // The IITDh faculty member who champions this partnership.
  championName: z.string().trim().max(200).optional(),
  championEmail: z.string().trim().email("Must be a valid email").max(255).optional(),
  championDesignation: z.string().trim().max(200).optional(),
  isActive: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updatePartnerSchema = partialForUpdate(createPartnerSchema);
export const partnerIdSchema = z.object({ id: z.string().uuid("Invalid ID") });
export const listPartnersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  type: PartnerTypeEnum.optional(),
  country: z.string().trim().optional(),
  // "country" groups the table by nation, which is how the partners page shows
  // them — one flag-headed block per country.
  sortBy: z.enum(["country", "name", "type"]).default("type"),
  isActive: queryBoolean(),
});

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
export type ListPartnersQuery = z.infer<typeof listPartnersSchema>;
