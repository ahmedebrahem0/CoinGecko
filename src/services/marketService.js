import {
  API_BASE_URL,
  API_KEY,
  fetchFromAPI,
  fetchFromGeckoTerminal,
} from "./apiConfig";

// Global Stats
export const getGlobalStats = (opts = {}) =>
  fetchFromAPI("/global", "", { ttlMs: 60_000, retries: 3, backoffMs: 1000, signal: opts.signal });

// Top Coins with proper 24h data
export const getTopCoins = (limit = 10) =>
  fetchFromAPI(
    "/coins/markets",
    `?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d,30d&locale=en`
  );

// Top Gainers - العملات الأكثر ارتفاعاً في 24 ساعة
export const getTopGainers = (limit = 3) =>
  fetchFromAPI(
    "/coins/markets",
    `?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h&locale=en`
  );

// Recently Added Coins - العملات المضافة حديثاً
export const getRecentlyAddedCoins = (limit = 8) =>
  fetchFromAPI(
    "/coins/markets",
    `?vs_currency=usd&order=created_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h&locale=en`
  );

// Trending - with proper error handling
export const getTrendingCoins = (opts = {}) =>
  fetchFromAPI("/search/trending", "", { ttlMs: 10 * 60 * 1000, signal: opts.signal });

// Sparkline data for charts
export const getSparklineData = (coinId, opts = {}) =>
  fetchFromAPI(
    `/coins/${coinId}/market_chart`,
    "?vs_currency=usd&days=7&interval=daily",
    { ttlMs: 120_000, retries: 4, backoffMs: 1500, signal: opts.signal }
  );

// Get specific coin details
export const getCoinDetails = (coinId, opts = {}) =>
  fetchFromAPI(
    `/coins/${coinId}`,
    "?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true",
    { ttlMs: 180_000, retries: 4, backoffMs: 1500, signal: opts.signal }
  );

// Get coin price chart data
export const getCoinPriceChart = (coinId, days = 7, currency = "usd", opts = {}) => {
  const d = days === "max" ? "max" : Number(days);
  const interval = d === 1 ? "hourly" : "auto";
  const ttlMs = d === 1 ? 3 * 60 * 1000 : 10 * 60 * 1000;
  return fetchFromAPI(
    `/coins/${coinId}/market_chart`,
    `?vs_currency=${currency}&days=${days}&interval=${interval}`,
    { ttlMs, retries: 4, backoffMs: 1500, signal: opts.signal }
  );
}

// Get coin market chart data for different timeframes
export const getCoinMarketChart = (coinId, days = 1, currency = "usd", opts = {}) =>
  fetchFromAPI(
    `/coins/${coinId}/market_chart`,
    `?vs_currency=${currency}&days=${days}&interval=auto`,
    { ttlMs: 180_000, retries: 4, backoffMs: 1500, signal: opts.signal }
  );
// Top Pools by Token Address - أفضل pools للعملة المحددة (GeckoTerminal)
export const getTopPoolsByToken = (networkId, tokenAddress, limit = 10, opts = {}) =>
  fetchFromGeckoTerminal(
    `/networks/${networkId}/tokens/${tokenAddress}/pools`,
    `?limit=${limit}`,
    { signal: opts.signal }
  );

// Get supported networks list (GeckoTerminal)
export const getSupportedNetworks = (opts = {}) => fetchFromGeckoTerminal("/networks", "", { signal: opts.signal });

// Get trending pools across all networks (GeckoTerminal)
export const getTrendingPools = (limit = 10, opts = {}) =>
  fetchFromGeckoTerminal("/networks/trending_pools", `?limit=${limit}`, { signal: opts.signal });
