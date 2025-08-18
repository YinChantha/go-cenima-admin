import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Booking } from "@/components/types/booking";
import { Calendar, Clock } from "lucide-react";
import { ViewBooking } from "./booking-action";

export const recentBookingColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {row.original.id.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="font-medium">{row.original.id.slice(0, 8)}...</div>
      </div>
    ),
  },
  {
    header: "Date & Time",
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {formatDate(row.original.createdAt)}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {row.original.lastBooking.bookingTime}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "packageRestaurantId",
    header: "Package",
    cell: ({ row }) => (
      <span>{row.original.packageRestaurantId.slice(0, 8)}...</span>
    ),
  },
  {
    accessorKey: "userId",
    header: "Customer",
    cell: ({ row }) => <span>{row.original.userId.slice(0, 8)}...</span>,
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.paymentStatus === "paid"
            ? "default"
            : row.original.paymentStatus === "pending"
            ? "outline"
            : "destructive"
        }
        className="capitalize"
      >
        {row.original.paymentStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">
        ${Number(getValue()).toFixed(2)}
      </div>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => <ViewBooking bookingId={row.id} />,
  },
];
