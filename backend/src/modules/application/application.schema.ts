import { z } from "zod";
import { updateInboundRecordSchema } from "../inbound-shared/inbound-record.schema.js";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]);
const EnglishTestTypeEnum = z.enum([
  "IELTS",
  "TOEFL",
  "PTE",
  "DUOLINGO",
  "NATIVE_SPEAKER",
  "OTHER",
  "NOT_APPLICABLE",
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
// Inbound applicants may not fit the three standard levels, so the form offers
// "Other (please specify)". The course catalogue (Program) keeps its own
// three-value enum and never accepts OTHER.
const ProgramLevelEnum = z.enum(["UNDERGRADUATE", "POSTGRADUATE", "PHD", "OTHER"]);

export const createApplicationSchema = z
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

    programLevel: ProgramLevelEnum,
    programLevelOther: z.string().trim().max(200).optional(),
    programAppliedFor: z.string().trim().min(1).max(200),
    intendedIntake: z.string().trim().min(1).max(50),
    highestQualification: z.string().trim().min(1).max(200),
    previousInstitution: z.string().trim().min(1).max(300),
    previousGradeOrGPA: z.string().trim().min(1).max(100),
    englishTestType: EnglishTestTypeEnum.default("NOT_APPLICABLE"),
    englishTestScore: z.string().trim().max(50).optional(),

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
  });

export const updateApplicationStatusSchema = z.object({
  status: ApplicationStatusEnum.optional(),
  reviewNotes: z.string().trim().optional(),
});

// Office record — admin-only, kept apart from the status update so review and
// record-keeping do not overwrite each other.
export const updateApplicationRecordSchema = updateInboundRecordSchema;

export const applicationIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export const documentFieldParamSchema = z.object({
  id: z.string().uuid("Invalid ID"),
  field: z.enum([
    "passportCopy",
    "photo",
    "academicTranscripts",
    "englishTestScoreCard",
    "statementOfPurpose",
    "financialProof",
    "recommendationLetter",
  ]),
});

const applicationFilterShape = {
  status: ApplicationStatusEnum.optional(),
  nationality: z.string().trim().optional(),
  programLevel: ProgramLevelEnum.optional(),
  search: z.string().trim().optional(),
};

export const listApplicationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  ...applicationFilterShape,
});

// The spreadsheet covers the whole filtered set, so no pagination here.
export const exportApplicationsSchema = z.object(applicationFilterShape);

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type UpdateApplicationRecordInput = z.infer<typeof updateApplicationRecordSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>;
export type ExportApplicationsQuery = z.infer<typeof exportApplicationsSchema>;
