import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useCity(limit: number, offset: number, status?:string, servicesOffer?:string) {
  return useQuery({
    queryKey: ["cities", { limit, offset, status, servicesOffer }],
    queryFn: async () => {
      const res = await apiClient.get("/client/cities", {
        params: { limit, offset, status, servicesOffer },
      });
      return res.data;
    },
    staleTime: Infinity,
  });
}
