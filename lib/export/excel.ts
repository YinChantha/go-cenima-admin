// /lib/export/excel.ts

export const EXCEL_GREEN_HEX = "#107C41";
export const EXCEL_GREEN_RGB = "FF107C41";
export const WHITE_RGB = "FFFFFFFF";

export function prettifyHeader(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

export function coerceDateMaybe(v: any) {
  if (v == null) return v;
  if (v instanceof Date) return v;
  if (typeof v === "string") {
    const d = new Date(v);           // also parses: "Mon Jul 21 2025 11:55:16 GMT+0700 ..."
    if (!isNaN(d.getTime())) return d;
  }
  return v;
}


export function collectKeys<T extends Record<string, any>>(rows: T[]) {
  const set = new Set<string>();
  for (const r of rows) Object.keys(r || {}).forEach((k) => set.add(k));
  return Array.from(set);
}

function encodeCol(colIndex0: number) {
  let s = "";
  let n = colIndex0;
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

function setColumnDateFormat(XLSX: any, ws: any, colIndex0: number, firstDataRow1: number, lastRow1: number, format = "ddd mmm dd yyyy") {
  for (let r = firstDataRow1; r <= lastRow1; r++) {
    const addr = `${encodeCol(colIndex0)}${r}`;
    const cell = ws[addr];
    if (cell && (cell.t === "d" || cell.v instanceof Date)) {
      cell.z = format;
    }
  }
}

export async function exportRowsToXlsx(opts: {
  rows: Record<string, any>[];
  keys: string[];
  fileName: string;
  sheetName?: string;
  humanizeHeaders?: boolean;
  styleHeaders?: boolean;
  headerColorRgb?: string;
  headerFontColorRgb?: string;
  dateFormat?: string;
}) {
  const {
    rows,
    keys,
    fileName,
    sheetName = "Sheet1",
    humanizeHeaders = true,
    styleHeaders = false,
    headerColorRgb = EXCEL_GREEN_RGB,
    headerFontColorRgb = WHITE_RGB,
    dateFormat = "ddd mmm dd yyyy",
  } = opts;

  if (!rows || rows.length === 0) {
    throw new Error("No rows were provided to export.");
  }
  if (!keys || keys.length === 0) {
    throw new Error("No columns (keys) were provided to export.");
  }

  const mod: any = styleHeaders ? await import("xlsx-js-style") : await import("xlsx");
  const XLSX: any = mod.default || mod; // <-- robust for ESM/CJS

  const headers = humanizeHeaders ? keys.map(prettifyHeader) : keys;

  const data = rows.map((r) => {
    const o: Record<string, any> = {};
    for (const k of keys) o[k] = coerceDateMaybe(r[k]);
    return o;
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([], { skipHeader: true });

  // add header + data
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
  XLSX.utils.sheet_add_json(ws, data, { header: keys, origin: "A2", skipHeader: true });

  // widths
  (ws as any)["!cols"] = keys.map((k: string) => ({ wch: Math.min(40, Math.max(12, k.length + 6)) }));

  // format date columns
  if (ws["!ref"]) {
    const range = XLSX.utils.decode_range(ws["!ref"]);
    const lastRow1 = range.e.r + 1;
    const firstDataRow1 = 2;
    for (let c = 0; c < keys.length; c++) {
      let hasDate = false;
      for (let r = firstDataRow1; r <= lastRow1; r++) {
        const cell = ws[`${encodeCol(c)}${r}`];
        if (cell && (cell.t === "d" || cell.v instanceof Date)) { hasDate = true; break; }
      }
      if (hasDate) setColumnDateFormat(XLSX, ws, c, firstDataRow1, lastRow1, dateFormat);
    }
  }

  // style header if requested (xlsx-js-style)
  if (styleHeaders && ws["!ref"]) {
    for (let c = 0; c < keys.length; c++) {
      const addr = `${encodeCol(c)}1`;
      const cell = ws[addr];
      if (!cell) continue;
      cell.s = {
        font: { bold: true, color: { rgb: headerFontColorRgb } },
        fill: { patternType: "solid", fgColor: { rgb: headerColorRgb } },
        alignment: { vertical: "center" },
      };
    }
  }

  // append sheet BEFORE write (prevents "Workbook is empty")
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}
