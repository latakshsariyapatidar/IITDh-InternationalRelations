import ExcelJS from "exceljs";
import type { Response } from "express";

// Thin wrapper over exceljs so the export and report modules describe sheets as
// plain data and share one place for header styling and response headers.

export const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** A cell rendered as a clickable link — used for document links in exports. */
export interface HyperlinkCell {
  text: string;
  hyperlink: string;
}

export type CellValue = string | number | Date | null | HyperlinkCell;

export interface SheetSpec {
  /** Excel caps sheet names at 31 chars and forbids : \ / ? * [ ]. */
  name: string;
  headers: readonly string[];
  rows: readonly CellValue[][];
  /** Per-column widths; falls back to a readable default. */
  columnWidths?: readonly number[];
}

export function hyperlinkCell(url: string, text = "Open"): HyperlinkCell {
  return { text, hyperlink: url };
}

const INVALID_SHEET_NAME_CHARS = /[:\\/?*[\]]/g;

// Day-first, as the office writes dates.
const DATE_FORMAT = "dd-mm-yyyy";

function toSafeSheetName(name: string): string {
  return name.replace(INVALID_SHEET_NAME_CHARS, " ").slice(0, 31);
}

/**
 * Neutralizes spreadsheet formula injection (CWE-1236).
 * Values beginning with formula operators (=, +, -, @, \t, \r) are prefixed with '
 * so spreadsheet applications treat them as literal text instead of executable formulas.
 */
export function sanitizeFormulaCell(cell: CellValue): CellValue {
  if (typeof cell === "string" && /^[=+\-@\t\r]/.test(cell)) {
    return `'${cell}`;
  }
  return cell;
}

export function buildWorkbook(sheets: readonly SheetSpec[]): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date();

  for (const spec of sheets) {
    const sheet = workbook.addWorksheet(toSafeSheetName(spec.name));

    const headerRow = sheet.addRow([...spec.headers]);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", wrapText: true };

    for (const row of spec.rows) {
      const added = sheet.addRow(row.map((cell) => sanitizeFormulaCell(cell) ?? ""));

      added.eachCell((cell) => {
        // Without an explicit format Excel shows a date as its serial number
        // (46235 rather than 01-08-2026). Columns mix dates with plain text —
        // "Year of Joining" may hold either — so format per cell, not per column.
        if (cell.value instanceof Date) {
          cell.numFmt = DATE_FORMAT;
          return;
        }

        // exceljs renders {text, hyperlink} as a link but leaves it unstyled, so
        // colour it the way a reader expects a link to look.
        if (cell.value && typeof cell.value === "object" && "hyperlink" in cell.value) {
          cell.font = { color: { argb: "FF0563C1" }, underline: true };
        }
      });
    }

    spec.headers.forEach((header, index) => {
      sheet.getColumn(index + 1).width =
        spec.columnWidths?.[index] ?? Math.min(Math.max(header.length + 4, 14), 40);
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  return workbook;
}

/** Streams a workbook as a download. `filename` should include the extension. */
export async function sendWorkbook(
  res: Response,
  workbook: ExcelJS.Workbook,
  filename: string,
): Promise<void> {
  res.setHeader("Content-Type", XLSX_CONTENT_TYPE);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  await workbook.xlsx.write(res);
  res.end();
}

/** `report-2026-09-03.xlsx` style names, safe on every filesystem. */
export function timestampedFilename(prefix: string): string {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.xlsx`;
}
