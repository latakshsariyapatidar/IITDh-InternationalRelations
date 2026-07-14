import { z } from "zod";

export const createPartnerSchema = z.object({
  name: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(100),
  type: z.enum(["UNIVERSITY", "ORGANIZATION"]),
  focus: z.string().trim().max(200).optional(),
  website: z.string().url("Must be a valid URL").max(500).optional(),
  logoUrl: z.string().regex(/^(https?:\/\/|\/)/, "Must be a valid URL or path").max(500).optional(),
  isActive: z.boolean().default(true),
});

export const updatePartnerSchema = createPartnerSchema.partial();
export const partnerIdSchema = z.object({ id: z.string().uuid("Invalid ID") });
export const listPartnersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  type: z.enum(["UNIVERSITY", "ORGANIZATION"]).optional(),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;
export type ListPartnersQuery = z.infer<typeof listPartnersSchema>;
