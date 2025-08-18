import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useBookingStats(
  limit: number,
  offset: number,
  startDate?: string,
  endDate?: string,
  branchId?: string,
  checkoutStatus?: string
) {
  return useQuery({
    queryKey: ["checkouts", { limit, offset, startDate, endDate, branchId, checkoutStatus }],
    queryFn: async () => {
      const res = await apiClient.get("/client/checkouts", {
        params: {
          limit,
          offset,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(branchId && branchId !== "all" && { branchId }),
          ...(checkoutStatus && { checkoutStatus })        },
      });
      return res.data;
    },
    staleTime: Infinity,
  });
}