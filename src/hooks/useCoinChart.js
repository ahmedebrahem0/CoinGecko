import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCoinPriceChart } from "../services/marketService";

/**
 * Fetch and normalize coin price chart data.
 * Returns { data: [{ ts, time, price, volume, marketCap }], isLoading, isFetching, error }
 */
export const useCoinChart = (coinId, days = "7", currency = "usd", options = {}) => {
  const enabled = options.enabled ?? Boolean(coinId);
  const query = useQuery({
    queryKey: ["coinChart", coinId, String(days), currency],
    queryFn: ({ signal }) => getCoinPriceChart(coinId, days, currency, { signal }),
    staleTime: days === "1" ? 3 * 60 * 1000 : 10 * 60 * 1000,
    retry: 1,
    enabled,
    select: (raw) => {
      if (!raw || !Array.isArray(raw.prices)) return [];
      // Map API arrays to objects
      const priceMap = new Map(raw.prices.map(([t, p]) => [t, p]));
      const volumeMap = new Map((raw.total_volumes || []).map(([t, v]) => [t, v]));
      const mcMap = new Map((raw.market_caps || []).map(([t, m]) => [t, m]));
      return raw.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        let timeLabel = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (days === "1") {
          timeLabel = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        } else if (days === "7") {
          timeLabel = date.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit", hour12: false });
        }
        return {
          ts: timestamp,
          time: timeLabel,
          price,
          volume: volumeMap.get(timestamp) || 0,
          marketCap: mcMap.get(timestamp) || 0,
        };
      });
    },
  });

  const stats = useMemo(() => {
    const data = query.data || [];
    if (data.length === 0) return null;
    const first = data[0].price;
    const last = data[data.length - 1].price;
    const min = Math.min(...data.map((d) => d.price));
    const max = Math.max(...data.map((d) => d.price));
    const changePct = ((last - first) / first) * 100;
    return { first, last, min, max, changePct };
  }, [query.data]);

  return {
    data: query.data || [],
    stats,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
