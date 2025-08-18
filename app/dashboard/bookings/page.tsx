"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DateRangePicker } from "@/components/date-range-picker";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bookings } from "@/components/dashboard/bookings/bookings";
import { DateRange } from "react-day-picker";
import { useBranchStats } from "@/hooks/use-branch";
import {
  BOOKING_STATUSES,
  BookingStatus,
  STATUS_COLOR_MAP,
} from "@/components/constants/statuses";

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchId, setBranchId] = useState<string>('all');
  const [tempBranchId, setTempBranchId] = useState<string>('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data, isLoading } = useBranchStats(10, 0, "pending", "dine-in");
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const getStatusBorderColor = (status: BookingStatus) =>
    STATUS_COLOR_MAP[status as Exclude<BookingStatus, "all">] ?? "default";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your restaurant bookings and reservations.
          </p>
        </div>
        <DateRangePicker
          date={dateRange}
          setDate={setDateRange}
          className="w-full md:w-auto"
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className={`w-[160px] border-${getStatusBorderColor(
                statusFilter as BookingStatus
              )}`}
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "all" ? "All Statuses" : capitalize(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Filter bookings by various criteria
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Branch</h3>
                  <Select value={tempBranchId} onValueChange={setTempBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {data?.data?.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <SheetFooter>
                  <Button
                    type="submit"
                    className="w-full mt-8"
                    onClick={() => {
                      setBranchId(tempBranchId);
                      setSheetOpen(false);
                    }}
                  >
                    Apply Filters
                  </Button>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Bookings dateRange={dateRange} branchId={branchId} excludeColumns={["id", "branchId", "checkoutStatus", "remark"]} />
    </div>
  );
}
