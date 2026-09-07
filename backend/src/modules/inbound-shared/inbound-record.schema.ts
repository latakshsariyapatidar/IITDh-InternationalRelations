import { z } from "zod";

// The office record: columns the IRO fills in after a student applies — roll
// number, FRRO forms, visa dates, faculty advisor, exit date. Deliberately not
// part of any public submission schema; both inbound modules expose it only
// through their admin-only `PATCH /:id/record` route.
//
// Every field is optional: the office fills these in a few at a time as
// documents arrive, so a partial update is the normal case.

export const inboundRecordSchema = z.object({
  rollNumber: z.string().trim().max(50).nullish(),
  instituteEmail: z.string().trim().email("Must be a valid email").max(255).nullish(),
  sponsoringAgency: z.string().trim().max(300).nullish(),
  yearOfJoining: z.string().trim().max(20).nullish(),
  dateOfJoining: z.coerce.date().nullish(),
  exitDate: z.coerce.date().nullish(),
  facultyAdvisor: z.string().trim().max(200).nullish(),
  citizenshipNo: z.string().trim().max(100).nullish(),
  passportIssueDate: z.coerce.date().nullish(),
  passportPlaceOfIssue: z.string().trim().max(200).nullish(),
  visaDetails: z.string().trim().max(200).nullish(),
  visaIssueDate: z.coerce.date().nullish(),
  visaExpiryDate: z.coerce.date().nullish(),
  visaPlaceOfIssue: z.string().trim().max(200).nullish(),
  sForm: z.string().trim().max(100).nullish(),
  cForm: z.string().trim().max(100).nullish(),
  officeRemarks: z.string().trim().nullish(),
});

export const updateInboundRecordSchema = inboundRecordSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type UpdateInboundRecordInput = z.infer<typeof updateInboundRecordSchema>;

/** Field names of the office record, for select clauses and export rows. */
export const INBOUND_RECORD_FIELDS = Object.keys(
  inboundRecordSchema.shape,
) as (keyof typeof inboundRecordSchema.shape)[];
