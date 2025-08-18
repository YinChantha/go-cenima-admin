"use client";

import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  ColumnDef,
} from "@tanstack/react-table";
import { useBookingStats } from "@/hooks/use-booking-stats";
import { excludeColumnsFrom } from "@/lib/utils";
import { RecentBookingsProps } from "../../types";
import { PaginatedTable } from "../../global-table";
import { recentBookingColumns } from "../../columns/bookings";
import { apiClient } from "@/lib/api-client";
import { PagedResponse, useExcelExport } from "@/hooks/useExcelExport";

// ---- Expose a handle for the parent
export type BookingsHandle = {
  exportToExcel: () => Promise<void>;
  isExporting?: () => boolean;
};

// Props
interface BookingsProps extends RecentBookingsProps {
  excludeColumns?: string[];
}

type Booking = Record<string, any>; // replace with your concrete type if you have it

export const Bookings = forwardRef<BookingsHandle, BookingsProps>(function Bookings(
  { dateRange, branchId, checkoutStatus, excludeColumns = [] },
  ref
) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
    };

    if (dateRange?.from) params.startDate = dateRange.from.toISOString().split("T")[0];
    if (dateRange?.to) params.endDate = dateRange.to.toISOString().split("T")[0];
    if (branchId && branchId !== "all") params.branchId = branchId;
    if (checkoutStatus) params.checkoutStatus = checkoutStatus;

    return params;
  }, [pagination, dateRange, branchId, checkoutStatus]);

  const { data, isError, error, isLoading } = useBookingStats(
    queryParams.limit,
    queryParams.offset,
    queryParams.startDate,
    queryParams.endDate,
    queryParams.branchId,
    queryParams.checkoutStatus
  );

  const filteredColumns = useMemo(() => {
    return excludeColumnsFrom(recentBookingColumns, excludeColumns);
  }, [excludeColumns]);

  const table = useReactTable({
    data: data?.data ?? [],
    columns: filteredColumns,
    pageCount: data ? Math.ceil(data.meta.total / data.meta.limit) : -1,
    state: { pagination },
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ---- Build export helpers (REUSABLE)
  const startDate = dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined;
  const endDate = dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined;
  const branch = branchId && branchId !== "all" ? branchId : undefined;
  const status = checkoutStatus;

  // Must mirror your hook’s key shape: ["checkouts", { limit, offset, startDate, endDate, branchId, checkoutStatus }]
  const makeKey = (offset: number, limit: number) => [
    "checkouts",
    { limit, offset, startDate, endDate, branchId: branch, checkoutStatus: status },
  ];

  const fetchPage = async (offset: number, limit: number): Promise<PagedResponse<Booking>> => {
    const params: Record<string, any> = {
      limit,
      offset,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(branch && { branchId: branch }), // never send "all"
      ...(status && { checkoutStatus: status }),
    };
    const res = await apiClient.get("/client/checkouts", { params });
    return res.data;
  };

  const { exportAll, isExporting } = useExcelExport<Booking>({
    pageSize: 1000,
    excludeKeys: excludeColumns,
    getFileName: () => `testing.xlsx`,
    sheetName: "Bookings",
    makeKey,
    fetchPage,
  });

  // Visible column order (if you want export to follow table order)
  const visibleKeysFromColumns = (filteredColumns as ColumnDef<any, any>[])
    .map((col: any) => col.accessorKey ?? col.id)
    .filter(Boolean) as string[];

  useImperativeHandle(ref, () => ({
    isExporting: () => isExporting,
    exportToExcel: async () => {
      await exportAll(visibleKeysFromColumns, 'testing');
    },
  }), [exportAll, isExporting, visibleKeysFromColumns]);

  if (isError) {
    return (
      <div className="text-center text-destructive">
        Error: {error instanceof Error ? error.message : "Failed to load bookings"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PaginatedTable
        table={table}
        isLoading={isLoading}
        data={data}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
});
