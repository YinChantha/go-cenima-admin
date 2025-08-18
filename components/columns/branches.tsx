// columns/branches.ts
import { ColumnDef } from "@tanstack/react-table";
import { BranchActions } from "./branch-actions";

export type Branch = {
  id: string;
  name: string;
  address: string;
  district: string;
  status: string;
  totalBooks: number;
  newCustomers: number;
  minPriceUsd: number;
  maxPriceUsd: number;
};

export const branchColumns: ColumnDef<Branch>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "district",
    header: "District",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "totalBooks",
    header: "Total Bookings",
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{Number(getValue())}</div>
    ),
  },
  {
    accessorKey: "newCustomers",
    header: "New Customers",
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{Number(getValue())}</div>
    ),
  },
  {
    accessorKey: "minPriceUsd",
    header: "Min Price ($)",
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">
        ${Number(getValue()).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "maxPriceUsd",
    header: "Max Price ($)",
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">
        ${Number(getValue()).toFixed(2)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <BranchActions branchId={row.original.id} />,
  },
];
