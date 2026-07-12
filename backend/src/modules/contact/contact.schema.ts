import { z } from "zod";

const ContactType = z.enum(["CHAIRPERSON", "IRO_OFFICE", "MOBILITY", "ADMISSION"]);

export const createContactSchema = z.object({
  type: ContactType,
  name: z.string().trim().max(200).optional(),
  title: z.string().trim().min(1).max(200),
  email: z.string().email("Invalid email").max(255),
  phone: z.string().trim().max(50).optional(),
  address: z.string().trim().max(500).optional(),
  isActive: z.boolean().default(true),
});

export const updateContactSchema = createContactSchema.partial();
export const contactIdSchema = z.object({ id: z.string().uuid() });
export const listContactsSchema = z.object({
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ListContactsQuery = z.infer<typeof listContactsSchema>;
