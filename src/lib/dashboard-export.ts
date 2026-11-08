import type { OverviewFilters } from "./dashboard-api";

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
}

export type ExportCell = string | number | boolean | Date | null;

export interface ExportSheet {
  name: string;
  columns: ExportColumn[];
  rows: Record<string, ExportCell>[];
}

export interface DashboardExportData {
  reportTitle: string;
  rangeLabel: string;
  filters: OverviewFilters;
  summary: { metric: string; value: ExportCell }[];
  sheets: ExportSheet[];
}

function excelColumnName(columnNumber: number) {
  let name = "";
  let number = columnNumber;

  while (number > 0) {
    const remainder = (number - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    number = Math.floor((number - 1) / 26);
  }

  return name;
}

function formatRange(filters: OverviewFilters, rangeLabel: string) {
  if (filters.startDate && filters.endDate) {
    return `${filters.startDate} to ${filters.endDate}`;
  }
  return rangeLabel;
}

export async function downloadDashboardWorkbook(data: DashboardExportData) {
  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();
  workbook.creator = "CampusHut Admin";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.subject = `${data.reportTitle} dashboard export`;

  const overview = workbook.addWorksheet("Overview");
  overview.columns = [{ width: 34 }, { width: 34 }];
  overview.mergeCells("A1:B1");
  overview.getCell("A1").font = { bold: true, size: 14, color: { argb: "FF166534" } };
  overview.getCell("A1").value = data.reportTitle;
  overview.addRow(["Date range", formatRange(data.filters, data.rangeLabel)]);
  overview.addRow(["Generated", new Date()]);
  overview.addRow([]);
  overview.addRow(["Metric", "Value"]);
  data.summary.forEach(({ metric, value }) => overview.addRow([metric, value]));
  overview.getRow(5).font = { bold: true, color: { argb: "FFFFFFFF" } };
  overview.getRow(5).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF166534" },
  };
  overview.getCell("B3").numFmt = "yyyy-mm-dd hh:mm";
  overview.views = [{ state: "frozen", ySplit: 5 }];

  for (const sheet of data.sheets) {
    const worksheet = workbook.addWorksheet(sheet.name);
    worksheet.columns = sheet.columns.map((column) => ({
      header: column.header,
      key: column.key,
      width: column.width ?? Math.min(Math.max(column.header.length + 4, 14), 36),
    }));
    worksheet.addRows(sheet.rows);
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    worksheet.pageSetup = {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    const header = worksheet.getRow(1);
    header.height = 24;
    header.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF166534" },
    };
    header.alignment = { vertical: "middle", wrapText: true };

    if (sheet.columns.length && sheet.rows.length) {
      worksheet.autoFilter = {
        from: "A1",
        to: `${excelColumnName(sheet.columns.length)}${sheet.rows.length + 1}`,
      };
    }
  }

  const fileName = `${data.reportTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
}
