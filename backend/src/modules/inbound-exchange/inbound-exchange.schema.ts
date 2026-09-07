import { z } from "zod";
import { updateInboundRecordSchema } from "../inbound-shared/inbound-record.schema.js";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]);
const ProgramLevelEnum = z.enum(["UNDERGRADUATE", "POSTGRADUATE", "PHD", "OTHER"]);
const ExchangeTypeEnum = z.enum([
  "SEMESTER_EXCHANGE",
  "RESEARCH_INTERNSHIP",
  "SUMMER_PROGRAM",
  "OTHER",
]);
const ApplicationStatusEnum = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUESTED",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
  "WITHDRAWN",
]);

export const createExchangeApplicationSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    dateOfBirth: z.coerce.date(),
    gender: GenderEnum,
    nationality: z.string().trim().min(1).max(100),
    countryOfResidence: z.string().trim().min(1).max(100),
    passportNumber: z.string().trim().min(1).max(50),
    passportExpiryDate: z.coerce.date(),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(1).max(50),
    currentAddress: z.string().trim().min(1),
    emergencyContactName: z.string().trim().min(1).max(200),
    emergencyContactPhone: z.string().trim().min(1).max(50),
    emergencyContactRelation: z.string().trim().max(100).optional(),

    homeUniversity: z.string().trim().min(1).max(300),
    homeUniversityCountry: z.string().trim().min(1).max(100),
    homeProgramOfStudy: z.string().trim().min(1).max(200),
    exchangeType: ExchangeTypeEnum,
    exchangeTypeOther: z.string().trim().max(200).optional(),
    programLevel: ProgramLevelEnum,
    programLevelOther: z.string().trim().max(200).optional(),
    proposedDepartment: z.string().trim().max(200).optional(),
    proposedFacultyHost: z.string().trim().max(200).optional(),
    intendedStayFrom: z.coerce.date(),
    intendedStayTo: z.coerce.date(),
    purposeOfVisit: z.string().trim().min(1),

    visaCategory: z.string().trim().max(100).optional(),
    requiresVisaSponsorship: z.coerce.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.programLevel === "OTHER" && !data.programLevelOther) {
      ctx.addIssue({
        code: "custom",
        path: ["programLevelOther"],
        message: "Please specify the program level",
      });
    }

    if (data.exchangeType === "OTHER" && !data.exchangeTypeOther) {
      ctx.addIssue({
        code: "custom",
        path: ["exchangeTypeOther"],
        message: "Please specify the type of exchange",
      });
    }

    if (data.intendedStayTo < data.intendedStayFrom) {
      ctx.addIssue({
        code: "custom",
        path: ["intendedStayTo"],
        message: "End of stay cannot be before its start",
      });
    }
  });

export const updateExchangeApplicationStatusSchema = z.object({
  status: ApplicationStatusEnum.optional(),
  reviewNotes: z.string().trim().optional(),
});

export const updateExchangeApplicationRecordSchema = updateInboundRecordSchema;

export const exchangeApplicationIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export const exchangeDocumentFieldParamSchema = z.object({
  id: z.string().uuid("Invalid ID"),
  field: z.enum([
    "passportCopy",
    "photo",
    "academicTranscripts",
    "nominationLetter",
    "statementOfPurpose",
    "financialProof",
    "recommendationLetter",
  ]),
});

const exchangeFilterShape = {
  status: ApplicationStatusEnum.optional(),
  nationality: z.string().trim().optional(),
  exchangeType: ExchangeTypeEnum.optional(),
  homeUniversity: z.string().trim().optional(),
  search: z.string().trim().optional(),
};

export const listExchangeApplicationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  ...exchangeFilterShape,
});

export const exportExchangeApplicationsSchema = z.object(exchangeFilterShape);

export type CreateExchangeApplicationInput = z.infer<typeof createExchangeApplicationSchema>;
export type UpdateExchangeApplicationStatusInput = z.infer<
  typeof updateExchangeApplicationStatusSchema
>;
export type UpdateExchangeApplicationRecordInput = z.infer<
  typeof updateExchangeApplicationRecordSchema
>;
export type ListExchangeApplicationsQuery = z.infer<typeof listExchangeApplicationsSchema>;
export type ExportExchangeApplicationsQuery = z.infer<typeof exportExchangeApplicationsSchema>;
