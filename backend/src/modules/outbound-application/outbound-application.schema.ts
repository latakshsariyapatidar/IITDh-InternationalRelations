import { z } from "zod";

const OutboundProgramTypeEnum = z.enum([
  "SEMESTER_EXCHANGE",
  "RESEARCH_INTERNSHIP",
  "SUMMER_PROGRAM",
  "DUAL_DEGREE",
  "OTHER",
]);
const OutboundApplicationStatusEnum = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "NOMINATED",
  "ACCEPTED_BY_PARTNER",
  "REJECTED",
  "WITHDRAWN",
]);

export const createOutboundApplicationSchema = z.object({
  partnerId: z.string().uuid("Invalid partner"),
  rollNumber: z.string().trim().min(1).max(50),
  branch: z.string().trim().min(1).max(200),
  currentYear: z.string().trim().min(1).max(50),
  cgpa: z.string().trim().min(1).max(20),
  programType: OutboundProgramTypeEnum,
  intendedSemester: z.string().trim().min(1).max(50),
  motivation: z.string().trim().min(1),
});

export const updateOutboundApplicationStatusSchema = z.object({
  status: OutboundApplicationStatusEnum.optional(),
  reviewNotes: z.string().trim().optional(),
});

export const outboundApplicationIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

export const outboundDocumentFieldParamSchema = z.object({
  id: z.string().uuid("Invalid ID"),
  field: z.enum([
    "statementOfPurpose",
    "transcript",
    "recommendationLetter",
  ]),
});

export const listOutboundApplicationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: OutboundApplicationStatusEnum.optional(),
  partnerId: z.string().uuid().optional(),
});

export type CreateOutboundApplicationInput = z.infer<typeof createOutboundApplicationSchema>;
export type UpdateOutboundApplicationStatusInput = z.infer<typeof updateOutboundApplicationStatusSchema>;
export type ListOutboundApplicationsQuery = z.infer<typeof listOutboundApplicationsSchema>;
