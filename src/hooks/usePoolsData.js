import { useQuery } from "@tanstack/react-query";
import {
  getTopPoolsByToken,
  getSupportedNetworks,
  getTrendingPools,
} from "../services/marketService";

// بيانات افتراضية للاختبار
const mockNetworks = [
  { id: "ethereum", name: "Ethereum" },
  { id: "polygon", name: "Polygon" },
  { id: "bsc", name: "BNB Smart Chain" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "optimism", name: "Optimism" },
  { id: "avalanche", name: "Avalanche" },
  { id: "fantom", name: "Fantom" },
  { id: "cronos", name: "Cronos" },
];

const mockTrendingPools = [
  {
    id: "1",
    base_token_symbol: "ETH",
    quote_token_symbol: "USDC",
    dex_id: "Uniswap V3",
    network_id: "ethereum",
    volume_24h: 15000000,
    price_change_percentage_24h: 2.5,
  },
  {
    id: "2",
    base_token_symbol: "MATIC",
    quote_token_symbol: "USDT",
    dex_id: "QuickSwap",
    network_id: "polygon",
    volume_24h: 8000000,
    price_change_percentage_24h: -1.2,
  },
  {
    id: "3",
    base_token_symbol: "BNB",
    quote_token_symbol: "BUSD",
    dex_id: "PancakeSwap",
    network_id: "bsc",
    volume_24h: 12000000,
    price_change_percentage_24h: 3.8,
  },
  {
    id: "4",
    base_token_symbol: "ARB",
    quote_token_symbol: "USDC",
    dex_id: "Uniswap V3",
    network_id: "arbitrum",
    volume_24h: 5000000,
    price_change_percentage_24h: 1.5,
  },
  {
    id: "5",
    base_token_symbol: "OP",
    quote_token_symbol: "USDC",
    dex_id: "Uniswap V3",
    network_id: "optimism",
    volume_24h: 3000000,
    price_change_percentage_24h: -0.8,
  },
];

export const usePoolsData = () => {
  const networksQuery = useQuery({
    queryKey: ["networks"],
    queryFn: async ({ signal }) => {
      try {
      const networksData = await getSupportedNetworks({ signal });
      if (Array.isArray(networksData)) {
          return networksData;
      } else if (networksData && Array.isArray(networksData.data)) {
          return networksData.data;
      } else {
          console.warn(
            "Networks data is not in expected format:",
            networksData
          );
          return mockNetworks;
      }
    } catch (err) {
      console.error("Failed to fetch networks:", err);
        return mockNetworks;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  const trendingPoolsQuery = useQuery({
    queryKey: ["trendingPools"],
    queryFn: async ({ signal }) => {
      try {
        const poolsData = await getTrendingPools(undefined, { signal });
      if (Array.isArray(poolsData)) {
          return poolsData;
      } else if (poolsData && Array.isArray(poolsData.data)) {
          return poolsData.data;
      } else {
        console.warn(
          "Trending pools data is not in expected format:",
          poolsData
        );
          return mockTrendingPools;
      }
    } catch (err) {
      console.error("Failed to fetch trending pools:", err);
        return mockTrendingPools;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    networks: networksQuery.data || mockNetworks,
    trendingPools: trendingPoolsQuery.data || mockTrendingPools,
    loading: networksQuery.isLoading || trendingPoolsQuery.isLoading,
    error: networksQuery.error || trendingPoolsQuery.error,
    refetchNetworks: networksQuery.refetch,
    refetchTrendingPools: trendingPoolsQuery.refetch,
  };
};
 