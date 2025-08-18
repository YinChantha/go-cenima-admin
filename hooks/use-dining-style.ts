import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useDiningTypes(limit: number, offset: number, status?:string, servicesOffer?:string) {
  return useQuery({
    queryKey: ["dining-styles", { limit, offset, status, servicesOffer }],
    queryFn: async () => {
      const res = await apiClient.get("/client/dining-styles", {
        params: { limit, offset, status, servicesOffer },
      });
      return res.data;
    },
    staleTime: Infinity,
  });
}
