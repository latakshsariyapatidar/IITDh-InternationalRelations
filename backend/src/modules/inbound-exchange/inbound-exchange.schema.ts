import { z } from "zod";
import { calendarDate, formBoolean } from "../../shared/utils/zodHelpers.js";
import { updateInboundRecordSchema } from "../inbound-shared/inbound-record.schema.js";
import { isNepalOrBhutanNational } from "../inbound-shared/nationality.js";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]);
const DisciplineEnum = z.enum(["ENGINEERING", "SCIENCE", "HUMANITIES"]);
const EnglishTestEnum = z.enum(["TOEFL", "IELTS"]);

// The IITDH programme the visitor joins. programLevel, which the admin list
// and filters use, is derived from it in the service.
export const PROGRAM_APPLIED_FOR = ["BTECH", "MSC", "MS", "PHD"] as const;
const ProgramAppliedForEnum = z.enum(PROGRAM_APPLIED_FOR);

// The passport must stay valid for at least six months from the date of
// application.
const PASSPORT_MIN_VALIDITY_MONTHS = 6;
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
    dateOfBirth: calendarDate(),
    gender: GenderEnum,
    nationality: z.string().trim().min(1).max(100),
    countryOfResidence: z.string().trim().min(1).max(100),
    passportNumber: z.string().trim().min(1).max(50).optional(),
    passportExpiryDate: calendarDate().optional(),
    citizenshipNo: z.string().trim().min(1).max(100).optional(),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().min(1).max(50),
    currentAddress: z.string().trim().min(1),
    emergencyContactName: z.string().trim().min(1).max(200),
    emergencyContactPhone: z.string().trim().min(1).max(50),
    emergencyContactRelation: z.string().trim().max(100).optional(),

    homeUniversity: z.string().trim().min(1).max(300),
    homeUniversityCountry: z.string().trim().min(1).max(100),
    homeProgramOfStudy: z.string().trim().min(1).max(200),
    highestQualification: z.string().trim().min(1).max(200),
    previousGradeOrGPA: z.string().trim().min(1).max(100),
    discipline: DisciplineEnum,
    programAppliedFor: ProgramAppliedForEnum,
    englishTestType: EnglishTestEnum,
    englishTestScore: z.string().trim().min(1).max(50),
    exchangeType: ExchangeTypeEnum,
    exchangeTypeOther: z.string().trim().max(200).optional(),
    proposedDepartment: z.string().trim().max(200).optional(),
    proposedFacultyHost: z.string().trim().max(200).optional(),
    intendedStayFrom: calendarDate(),
    intendedStayTo: calendarDate(),
    purposeOfVisit: z.string().trim().min(1),

    visaCategory: z.string().trim().max(100).optional(),
    // NOT z.coerce.boolean(). This body arrives through multer as multipart
    // form data, so every field is a string, and `Boolean("false")` is true —
    // which meant every applicant who ticked "I do not need visa sponsorship"
    // was stored as needing it. formBoolean reads the string instead.
    requiresVisaSponsorship: formBoolean(true),
  })
  .superRefine((data, ctx) => {
    if (isNepalOrBhutanNational(data.nationality)) {
      if (!data.citizenshipNo) {
        ctx.addIssue({
          code: "custom",
          path: ["citizenshipNo"],
          message: "Citizenship number is required for Nepal and Bhutan nationals",
        });
      }
    } else {
      if (!data.passportNumber) {
        ctx.addIssue({ code: "custom", path: ["passportNumber"], message: "Passport number is required" });
      }
      if (!data.passportExpiryDate) {
        ctx.addIssue({ code: "custom", path: ["passportExpiryDate"], message: "Passport expiry date is required" });
      }
    }

    if (data.passportExpiryDate) {
      const minimumExpiry = new Date();
      minimumExpiry.setUTCMonth(minimumExpiry.getUTCMonth() + PASSPORT_MIN_VALIDITY_MONTHS);
      if (data.passportExpiryDate < minimumExpiry) {
        ctx.addIssue({
          code: "custom",
          path: ["passportExpiryDate"],
          message: "Your passport must be valid for at least 6 months from today",
        });
      }
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
    "cv",
    "acceptanceLetter",
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
