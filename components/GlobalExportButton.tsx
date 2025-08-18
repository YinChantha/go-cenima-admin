"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useExcelExport } from "@/hooks/useExcelExport";

type Props<T> = Parameters<typeof useExcelExport<T>>[0] & {
  className?: string;
  label?: string;
};

export function GlobalExportButton<T>({
  className,
  label = "Export",
  ...config
}: Props<T>) {
  const { exportAll, isExporting } = useExcelExport<T>(config);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportAll}
      disabled={isExporting}
      className={className}
    >
      <FileDown className="h-4 w-4" />
      {isExporting ? "Exporting..." : label}
    </Button>
  );
}
