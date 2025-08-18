import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import TableSkeleton from "./loading";

interface PaginatedTableProps<TData> {
  table: TableType<TData>;
  isLoading: boolean;
  data: { meta?: { total: number; hasNext?: boolean } };
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (updater: (prev: { pageIndex: number; pageSize: number }) => { pageIndex: number; pageSize: number }) => void;
}

export function PaginatedTable<TData>({
  table,
  isLoading,
  data,
  pagination,
  setPagination,
}: PaginatedTableProps<TData>) {
  return (
    <div className="rounded-md border">
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {(data?.meta?.total ?? 0) >= 10 && (
        <div className="flex items-center justify-center gap-6 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8"
          >
            ← Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1}
            {table.getPageCount() > 0 && ` of ${table.getPageCount()}`}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!data?.meta?.hasNext}
            className="h-8"
          >
            Next →
          </Button>

          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: 0,
                pageSize: Number(value),
              }))
            }
          >
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
