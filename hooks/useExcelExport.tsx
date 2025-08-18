// /hooks/useExcelExport.ts
"use client";

import { useCallback, useState } from "react";
import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { collectKeys, coerceDateMaybe, exportRowsToXlsx } from "@/lib/export/excel";

export type PagedMeta = { total: number; limit: number; offset: number; hasNext?: boolean };
export type PagedResponse<T> = { data: T[]; meta: PagedMeta };

type UseExcelExportOptions<T> = {
  pageSize?: number;
  keys?: string[];
  excludeKeys?: string[];
  coerceDates?: boolean;
  sheetName?: string;
  getFileName?: () => string;
  getHasNext?: (page: PagedResponse<T> | undefined) => boolean;
  makeKey: (offset: number, limit: number) => QueryKey;
  fetchPage: (offset: number, limit: number) => Promise<PagedResponse<T>>;
  transformRow?: (row: Record<string, any>, original: T) => Record<string, any>;
};
// helper to ensure .xlsx and remove illegal characters
const ensureXlsx = (name?: string) => {
  const base = (name ?? "").trim() || "export";
  const safe = base.replace(/[\\/:*?"<>|]/g, "-");
  return safe.toLowerCase().endsWith(".xlsx") ? safe : `${safe}.xlsx`;
};
export function useExcelExport<T>(opts: UseExcelExportOptions<T>) {
  const {
    pageSize = 1000,
    keys,
    excludeKeys = [],
    coerceDates = true,
    sheetName = "Sheet1",
    getFileName = () => `testing.xlsx`,
    getHasNext,
    makeKey,
    fetchPage,
    transformRow,
  } = opts;

  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();

  // Accept optional visibleKeys to follow table order
  const exportAll = useCallback(
    async (visibleKeys?: string[], fileNameOverride?: string) => {
      setIsExporting(true);
      try {
        let offset = 0;
        const all: T[] = [];
        let safety = 100_000;

        const loadPage = async (off: number) => {
          const key = makeKey(off, pageSize);
          let page = queryClient.getQueryData<PagedResponse<T>>(key);
          if (!page) {
            page = await queryClient.fetchQuery({
              queryKey: key,
              queryFn: () => fetchPage(off, pageSize),
              staleTime: Infinity,
            });
          }
          return page;
        };

        while (safety > 0) {
          const page = await loadPage(offset);
          const rows = page?.data ?? [];
          all.push(...rows);
          safety -= rows.length;

          const hasNext =
            getHasNext?.(page) ??
            Boolean(
              page?.meta?.hasNext ??
                ((page?.meta?.offset ?? 0) + (page?.meta?.limit ?? 0) < (page?.meta?.total ?? 0))
            );

          if (!hasNext || rows.length === 0) break;
          offset += pageSize;
        }

        if (all.length === 0) {
          throw new Error("No rows to export for the current filters.");
        }

        // Prefer visible order; otherwise union
        let exportKeys = (visibleKeys?.length ? visibleKeys : collectKeys(all as any));
        if (excludeKeys.length) exportKeys = exportKeys.filter((k) => !excludeKeys.includes(k));
        if (keys?.length) exportKeys = keys;
        if (exportKeys.length === 0) {
          throw new Error("No columns to export after exclusions.");
        }

        const flat = (all as any[]).map((original) => {
          const obj: Record<string, any> = {};
          for (const k of exportKeys) {
            let v = (original as any)[k];
            if (coerceDates) v = coerceDateMaybe(v);
            obj[k] = v;
          }
          return transformRow ? transformRow(obj, original as any) : obj;
        });

                const finalName = ensureXlsx(fileNameOverride) || ensureXlsx(getFileName());


        // ⬇️ IMPORTANT: await the async exporter
        await exportRowsToXlsx({
          rows: flat,
          keys: exportKeys,
          fileName: finalName,
          sheetName,
          styleHeaders: true,            // header color (requires xlsx-js-style installed)
          dateFormat: "ddd mmm dd yyyy", // "Mon Jul 21 2025"
        });
      } finally {
        setIsExporting(false);
      }
    },
    [
      pageSize,
      keys,
      excludeKeys,
      coerceDates,
      sheetName,
      getFileName,
      getHasNext,
      makeKey,
      fetchPage,
      transformRow,
      queryClient,
    ]
  );

  return { exportAll, isExporting };
}
