import type { Request, Response } from "express";
import catchAsync from "../../shared/utils/catchAsync.js";
import { successResponse } from "../../shared/utils/apiResponse.js";
import { sendWorkbook, timestampedFilename } from "../../shared/utils/xlsx.js";
import * as service from "./report.service.js";
import type { InboundReportQuery, VisitorReportQuery } from "./report.schema.js";

export const getInboundReport = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as InboundReportQuery;

  if (query.format === "xlsx") {
    const workbook = await service.buildInboundReportWorkbook(query);
    await sendWorkbook(res, workbook, timestampedFilename("iro-inbound-report"));
    return;
  }

  const rows = await service.buildInboundReport(query);
  res.status(200).json(
    successResponse("Report generated", {
      from: query.from,
      to: query.to,
      type: query.type,
      total: rows.length,
      rows,
    }),
  );
});

export const getVisitorReport = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as VisitorReportQuery;

  if (query.format === "xlsx") {
    const workbook = await service.buildVisitorReportWorkbook(query);
    await sendWorkbook(res, workbook, timestampedFilename("iro-visitor-report"));
    return;
  }

  const visitors = await service.buildVisitorReport(query);
  res.status(200).json(
    successResponse("Report generated", {
      from: query.from,
      to: query.to,
      total: visitors.length,
      rows: visitors,
    }),
  );
});
