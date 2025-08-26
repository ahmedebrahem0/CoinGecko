import { useQuery } from "@tanstack/react-query";
import { getGlobalStats } from "../services/marketService";

export const useGlobalStats = () => {
  // Query for global stats with 10 minutes stale time
  // Global stats change less frequently, so longer stale time is appropriate
  const query = useQuery({
    queryKey: ["globalStats"],
    queryFn: ({ signal }) => getGlobalStats({ signal }),
    staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for global stats
    retry: 1,
  });

  return {
    globalStats: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
