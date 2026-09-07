import { z } from "zod";

export const createPartnerSchema = z.object({
  name: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(100),
  // ISO 3166-1 alpha-2. Derived from `country` when omitted; the partners table
  // renders a flag from it.
  countryCode: z.string().trim().length(2).toUpperCase().optional(),
  type: z.enum(["UNIVERSITY", "ORGANIZATION"]),
  focus: z.string().trim().max(200).optional(),
  website: z.string().url("Must be a valid URL").max(500).optional(),
  // Accepts an absolute URL or a site-relative path: logos uploaded through
  // POST /uploads/image/partners come back as "/uploads/partners/<file>",
  // which z.string().url() would reject.
  logoUrl: z
    .string()
    .regex(/^(https?:\/\/|\/)/, "Must be a valid URL or path")
    .max(500)
    .optional(),
  // The IITDh faculty member who champions this partnership.
  championName: z.string().trim().max(200).optional(),
  championEmail: z.string().trim().email("Must be a valid email").max(255).optional(),
  championDesignation: z.string().trim().max(200).optional(),
  isActive: z.boolean().default(true),
});

export const updatePartnerSchema = createPartnerSchema.partial();
export const partnerIdSchema = z.object({ id: z.string().uuid("Invalid ID") });
export const listPartnersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  type: z.enum(["UNIVERSITY", "ORGANIZATION"]).optional(),
  country: z.string().trim().optional(),
  // "country" groups the table by nation, which is how the partners page shows
  // them — one flag-headed block per country.
  sortBy: z.enum(["country", "name", "type"]).default("type"),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
export type ListPartnersQuery = z.infer<typeof listPartnersSchema>;
