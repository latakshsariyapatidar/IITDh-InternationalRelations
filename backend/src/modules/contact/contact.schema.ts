import { z } from "zod";
import { ContactType } from "@prisma/client";
import {
  partialForUpdate,
  prismaEnum,
  queryBoolean,
} from "../../shared/utils/zodHelpers.js";

// Derived from schema.prisma rather than typed out again. The hand-written
// copy listed four values while the database holds six, so the ADVISOR and
// ASSISTANT_REGISTRAR contacts the seed creates could not be edited through
// the admin panel.
const ContactTypeEnum = prismaEnum(ContactType);

export const createContactSchema = z.object({
  type: ContactTypeEnum,
  name: z.string().trim().max(200).optional(),
  title: z.string().trim().min(1).max(200),
  email: z.string().email("Invalid email").max(255),
  phone: z.string().trim().max(50).optional(),
  address: z.string().trim().max(500).optional(),
  isActive: z.boolean().default(true),
});

// partialForUpdate, not .partial(): .partial() leaves each field's
// .default() in place, so a PATCH naming one key silently rewrote every
// other column with its default. See shared/utils/zodHelpers.ts.
export const updateContactSchema = partialForUpdate(createContactSchema);
export const contactIdSchema = z.object({ id: z.string().uuid() });
export const listContactsSchema = z.object({
  isActive: queryBoolean(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ListContactsQuery = z.infer<typeof listContactsSchema>;
