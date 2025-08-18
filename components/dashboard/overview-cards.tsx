"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStats } from "@/hooks/use-booking-stats";
import { Calendar, Users } from "lucide-react";
import { RecentBookingsProps } from "../types/booking";

export default function OverviewCards({
  dateRange,
  branchId,
  checkoutStatus,
}: RecentBookingsProps) {
  const startDate = dateRange?.from?.toISOString().split("T")[0];
  const endDate = dateRange?.to?.toISOString().split("T")[0];
  const { data, isLoading } = useBookingStats(
    10,
    0,
    startDate,
    endDate,
    branchId !== "all" ? branchId : undefined,
    checkoutStatus !== "all" ? checkoutStatus : undefined
  );

  const Data = [
    {
      title: "Total Bookings",
      value: isLoading ? "..." : `${data?.meta.totalBooks}`,
      description: "Last 30 days",
      icon: Calendar,
      change: "+12%",
      trend: "up",
    },
    {
      title: "New Customers",
      value: isLoading ? "..." : `${data?.meta.newCustomers}`,
      description: "Last 30 days",
      icon: Users,
      change: "+18%",
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2">
      {Data.map((data, index) => (
        <Card key={index} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {data.title}
            </CardTitle>
            <div className="rounded-full bg-secondary p-2">
              <data.icon className="h-4 w-4 text-secondary-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span
                className={`mr-1 ${
                  data.trend === "up" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {data.change}
              </span>
              <span>{data.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
