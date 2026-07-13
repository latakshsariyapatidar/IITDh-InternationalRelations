import { z } from "zod";

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
const ProgramLevelEnum = z.enum(["UNDERGRADUATE", "POSTGRADUATE", "PHD"]);

export const createApplicationSchema = z.object({
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
  programAppliedFor: z.string().trim().min(1).max(200),
  intendedIntake: z.string().trim().min(1).max(50),
  highestQualification: z.string().trim().min(1).max(200),
  previousInstitution: z.string().trim().min(1).max(300),
  previousGradeOrGPA: z.string().trim().min(1).max(100),
  englishTestType: EnglishTestTypeEnum.default("NOT_APPLICABLE"),
  englishTestScore: z.string().trim().max(50).optional(),

  visaCategory: z.string().trim().max(100).optional(),
  requiresVisaSponsorship: z.coerce.boolean().default(true),
});

export const updateApplicationStatusSchema = z.object({
  status: ApplicationStatusEnum.optional(),
  reviewNotes: z.string().trim().optional(),
});

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

export const listApplicationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: ApplicationStatusEnum.optional(),
  nationality: z.string().trim().optional(),
  programLevel: ProgramLevelEnum.optional(),
  search: z.string().trim().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>;
