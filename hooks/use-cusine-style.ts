import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export function useCuisineTypes(limit: number, offset: number, status?:string, servicesOffer?:string) {
  return useQuery({
    queryKey: ["cuisine-types", { limit, offset, status, servicesOffer }],
    queryFn: async () => {
      const res = await apiClient.get("/client/cuisine-types", {
        params: { limit, offset, status, servicesOffer },
      });
      return res.data;
    },
    staleTime: Infinity,
  });
}
