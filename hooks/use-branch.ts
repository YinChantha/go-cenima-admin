import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useBranchStats(limit: number, offset: number, status?:string, servicesOffer?:string) {
  return useQuery({
    queryKey: ["branches", { limit, offset, status, servicesOffer }],
    queryFn: async () => {
      const res = await apiClient.get("/client/branches", {
        params: { limit, offset, status, servicesOffer },
      });
      return res.data;
    },
    staleTime: Infinity,
  });
}

export function useBranchById(id?: string) {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: async () => {
      const res = await apiClient.get(`/client/branches/${id}`);
      return res.data;
    },
    enabled: Boolean(id),      // don't run without an id
    staleTime: Infinity,
  });
}

