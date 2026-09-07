import { z } from "zod";

// Reports are always bounded by a date range — the office asks for "from this
// date to that date" and gets both an on-screen table and ma'am's spreadsheet.

const ORDERED_RANGE = {
  path: ["to"],
  message: '"to" date cannot be before "from" date',
};

export const inboundReportSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    // Which register(s) to report on.
    type: z.enum(["admission", "exchange", "both"]).default("both"),
    format: z.enum(["json", "xlsx"]).default("json"),
  })
  .refine((data) => data.from <= data.to, ORDERED_RANGE);

export const visitorReportSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    format: z.enum(["json", "xlsx"]).default("json"),
  })
  .refine((data) => data.from <= data.to, ORDERED_RANGE);

export type InboundReportQuery = z.infer<typeof inboundReportSchema>;
export type VisitorReportQuery = z.infer<typeof visitorReportSchema>;
