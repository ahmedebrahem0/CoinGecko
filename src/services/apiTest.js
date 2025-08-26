import { fetchFromAPI } from "./apiConfig";

export const testAPI = async () => {
  try {
    console.log("Testing API connection...");

    // Test global stats
    const globalStats = await fetchFromAPI("/global");
    console.log("Global stats test:", globalStats);

    // Test trending coins
    const trending = await fetchFromAPI("/search/trending");
    console.log("Trending test:", trending);

    // Test top coins
    const topCoins = await fetchFromAPI(
      "/coins/markets",
      "?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h"
    );
    console.log("Top coins test:", topCoins);

    return { success: true, data: { globalStats, trending, topCoins } };
  } catch (error) {
    console.error("API test failed:", error);
    return { success: false, error: error.message };
  }
};
