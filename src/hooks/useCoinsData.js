import { useQuery } from "@tanstack/react-query";
import { getTopCoins, getTrendingCoins } from "../services/marketService";

export const useCoinsData = () => {
  // Top coins (unified to 100) with 5 minutes stale time
  const topCoinsQ = useQuery({
    queryKey: ["topCoins", 100],
    queryFn: ({ signal }) => getTopCoins(100, { signal }),
    staleTime: 5 * 60 * 1000,
  });

  // Trending coins with 10 minutes stale time
  const trendingQ = useQuery({
    queryKey: ["trending"],
    queryFn: ({ signal }) => getTrendingCoins({ signal }),
    staleTime: 10 * 60 * 1000,
  });

  // Derive top gainers locally from top coins to avoid extra API calls
  const derivedGainers = (topCoinsQ.data || [])
    .slice()
    .filter((c) => typeof c.price_change_percentage_24h === "number")
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 3);

  return {
    topCoins: topCoinsQ.data,
    trendingCoins: trendingQ.data,
    topGainers: derivedGainers,
    loading: topCoinsQ.isLoading || trendingQ.isLoading,
    error: topCoinsQ.error?.message || trendingQ.error?.message || null,
  };
};
