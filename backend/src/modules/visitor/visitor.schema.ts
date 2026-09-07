import { z } from "zod";

// The delegate register. Anyone may submit this form without signing in, so it
// asks only for what the office needs and stays rate-limited; the records
// themselves are readable by admins only.

export const createVisitorSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required").max(200),
    designation: z.string().trim().max(200).optional(),
    organisation: z.string().trim().min(1, "Organisation is required").max(300),
    department: z.string().trim().max(200).optional(),
    country: z.string().trim().min(1, "Country is required").max(100),
    email: z.string().trim().email("Must be a valid email").max(255),
    phone: z.string().trim().max(50).optional(),
    nationality: z.string().trim().max(100).optional(),
    passportNumber: z.string().trim().max(50).optional(),
    purposeOfVisit: z.string().trim().min(1, "Purpose of visit is required"),
    visitFrom: z.coerce.date(),
    visitTo: z.coerce.date().optional(),
    hostName: z.string().trim().max(200).optional(),
    hostDepartment: z.string().trim().max(200).optional(),
    websiteOrProfileUrl: z.string().url("Must be a valid URL").max(500).optional(),
    remarks: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.visitTo && data.visitTo < data.visitFrom) {
      ctx.addIssue({
        code: "custom",
        path: ["visitTo"],
        message: "End of visit cannot be before its start",
      });
    }
  });

// Admins can correct submissions and mark them verified.
export const updateVisitorSchema = z.object({
  fullName: z.string().trim().min(1).max(200).optional(),
  designation: z.string().trim().max(200).nullish(),
  organisation: z.string().trim().min(1).max(300).optional(),
  department: z.string().trim().max(200).nullish(),
  country: z.string().trim().min(1).max(100).optional(),
  countryCode: z.string().trim().length(2).toUpperCase().nullish(),
  email: z.string().trim().email().max(255).optional(),
  phone: z.string().trim().max(50).nullish(),
  nationality: z.string().trim().max(100).nullish(),
  passportNumber: z.string().trim().max(50).nullish(),
  purposeOfVisit: z.string().trim().min(1).optional(),
  visitFrom: z.coerce.date().optional(),
  visitTo: z.coerce.date().nullish(),
  hostName: z.string().trim().max(200).nullish(),
  hostDepartment: z.string().trim().max(200).nullish(),
  websiteOrProfileUrl: z.string().url().max(500).nullish(),
  remarks: z.string().trim().nullish(),
  isVerified: z.boolean().optional(),
});

export const visitorIdSchema = z.object({ id: z.string().uuid("Invalid ID") });

const visitorFilterShape = {
  country: z.string().trim().optional(),
  search: z.string().trim().optional(),
  isVerified: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : v),
    z.boolean().optional(),
  ),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
};

export const listVisitorsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  ...visitorFilterShape,
});

export const exportVisitorsSchema = z.object(visitorFilterShape);

export type CreateVisitorInput = z.infer<typeof createVisitorSchema>;
export type UpdateVisitorInput = z.infer<typeof updateVisitorSchema>;
export type ListVisitorsQuery = z.infer<typeof listVisitorsSchema>;
export type ExportVisitorsQuery = z.infer<typeof exportVisitorsSchema>;
