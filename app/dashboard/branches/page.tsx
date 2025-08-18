"use client";

import { useBranchStats } from "@/hooks/use-branch";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { PaginatedTable } from "@/components/global-table";
import { branchColumns } from "@/components/columns/branches";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
export default function Branches() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data, isLoading } = useBranchStats(10, 0, "pending", "dine-in");
  const table = useReactTable({
    data: data?.data ?? [],
    columns: branchColumns,
    state: { pagination },
    manualPagination: true,
    pageCount: data ? Math.ceil(data.meta.total / data.meta.limit) : -1,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Restaurant</h1>
          <p className="text-muted-foreground">
            Manage your restaurant information, opening hours, and images.
          </p>
        </div>
        <Button variant="outline">
          <Link
            href="/dashboard/branches/create"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create
          </Link>
        </Button>
      </div>
      <PaginatedTable
        table={table}
        isLoading={isLoading}
        data={data}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}
