"use client";
import { useAuth } from "@/components/auth-provider";
import { Bookings } from "@/components/dashboard/bookings/bookings";
import { DateRangePicker } from "@/components/date-range-picker";
import OverviewCards from "@/components/dashboard/overview-cards";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranchStats } from "@/hooks/use-branch";
import { UserRole } from "@/components/types/role";
import { apiClient } from "@/lib/api-client";
import type { PagedResponse } from "@/hooks/useExcelExport";
import { GlobalExportButton } from "@/components/GlobalExportButton";

type Booking = Record<string, any>; // or your concrete Booking type

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.role === UserRole.SUPER_ADMIN ? user?.displayName : user?.lastName;
  const [branchId, setBranchId] = useState<string>("all");
  const checkoutStatus = "comming";
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: branches, isLoading: isBranchLoading } = useBranchStats(
    100,
    0,
    "pending",
    "dine-in"
  );

  // ---- Export config (reused by GlobalExportButton)
  const startDate = dateRange?.from
    ? dateRange.from.toISOString().split("T")[0]
    : undefined;
  const endDate = dateRange?.to
    ? dateRange.to.toISOString().split("T")[0]
    : undefined;
  const branch = branchId !== "all" ? branchId : undefined; // omit "all"
  const makeKey = (offset: number, limit: number) => [
    "checkouts",
    { limit, offset, startDate, endDate, branchId: branch, checkoutStatus },
  ];

  const fetchPage = async (
    offset: number,
    limit: number
  ): Promise<PagedResponse<Booking>> => {
    const params: Record<string, any> = {
      limit,
      offset,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(branch && { branchId: branch }), // do NOT send "all"
      ...(checkoutStatus && { checkoutStatus }),
    };
    const res = await apiClient.get("/client/checkouts", { params });
    return res.data;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back,{" "}
            <span className="font-bold tracking-tight">{name}</span>. Here's an
            overview of your restaurant.
          </p>
        </div>
        <DateRangePicker
          date={dateRange}
          setDate={setDateRange}
          className="w-full md:w-auto"
        />
      </div>

      <OverviewCards
        dateRange={dateRange}
        branchId={branchId}
        checkoutStatus={checkoutStatus}
      />

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <div className="flex items-center space-x-2">
            <GlobalExportButton<Booking>
              className="inline-flex items-center gap-2 bg-[#107C41] text-white hover:bg-green-600"
              label="Export"
              pageSize={1000}
              sheetName="Bookings"
              excludeKeys={["id", "branchId", "checkoutStatus", "remark"]}
              getFileName={() =>`bookings_${startDate ?? "all"}_${endDate ?? "all"}.xlsx`}
              makeKey={makeKey}
              fetchPage={fetchPage}
            />
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches?.data?.map((branch: any) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Bookings
            dateRange={dateRange}
            branchId={branchId}
            checkoutStatus={checkoutStatus}
            excludeColumns={["id", "branchId", "checkoutStatus", "remark"]}
          />
        </div>
      </div>
    </div>
  );
}
