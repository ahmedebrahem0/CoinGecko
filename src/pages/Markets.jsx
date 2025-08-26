import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiSettings,
  FiSearch,
  FiStar,
  FiFilter,
  FiDownload,
  FiShare2,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiBookmark,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiArrowUp,
  FiArrowDown,
  FiSliders,
} from "react-icons/fi";
import {
  FaFire,
  FaStar as StarIcon,
  FaChartLine,
  FaCoins,
} from "react-icons/fa";
import { usePortfolio } from "../context/PortfolioContext";
import { getTopCoins } from "../services/marketService";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import Sparkline from "../components/Sparkline";
import MarketsSkeleton from "../components/MarketsSkeleton";
import Error from "../components/Error";
import EnhancedSearch from "../components/EnhancedSearch";
import AdvancedFilters from "../components/AdvancedFilters";
import SortingControls from "../components/SortingControls";
import QuickActions from "../components/QuickActions";
import CoinCardView from "../components/CoinCardView";
import {
  formatVolume,
  formatPrice,
  formatMarketCap,
  filteredCoins,
  getPercentageColor,
  getPercentageIcon,
  getSearchSuggestions,
  getUniqueCategories,
  getPriceRanges,
  getMarketCapRanges,
  getVolumeRanges,
  getPerformanceOptions,
  getSortingOptions,
} from "../constant/marketsCoin";
import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  shareData,
  generateReport,
} from "../utils/dataExport";

const Markets = () => {
  const { isFavorite, toggleFavorite } = usePortfolio();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    priceRange: null,
    marketCap: null,
    volume: null,
    performance: "all",
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    field: searchParams.get("sort") || "market_cap",
    direction: searchParams.get("direction") || "desc",
  });

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (filters.category !== "All") params.set("category", filters.category);
    if (sortConfig.field) params.set("sort", sortConfig.field);
    if (sortConfig.direction) params.set("direction", sortConfig.direction);

    setSearchParams(params);
  }, [searchTerm, filters.category, sortConfig, setSearchParams]);

  // Data fetching
  const {
    data: coins,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["markets", 100],
    queryFn: ({ signal }) => getTopCoins(100, { signal }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Filtered and sorted coins
  const filteredAndSortedCoins = filteredCoins(
    coins,
    filters,
    searchTerm,
    sortConfig
  );

  // Determine which coins to display
  // If there's an active search or filters, show filtered results
  // Otherwise, show all coins
  const hasActiveSearchOrFilters =
    searchTerm ||
    filters.category !== "All" ||
    filters.priceRange ||
    filters.marketCap ||
    filters.volume ||
    filters.performance !== "all";

  const displayCoins = hasActiveSearchOrFilters
    ? filteredAndSortedCoins
    : coins;

  // Bookmarked coins
  const bookmarkedCoins = showBookmarks
    ? displayCoins.filter((coin) => isFavorite(coin.id))
    : displayCoins;

  // Action handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleToggleViewMode = () => {
    setViewMode((prev) => (prev === "table" ? "card" : "table"));
  };

  const handleToggleBookmarks = () => {
    setShowBookmarks((prev) => !prev);
  };

  const handleExportData = (format = "csv") => {
    const dataToExport =
      bookmarkedCoins.length > 0 ? bookmarkedCoins : filteredAndSortedCoins;

    switch (format) {
      case "csv":
        exportToCSV(
          dataToExport,
          `market-data-${new Date().toISOString().split("T")[0]}.csv`
        );
        break;
      case "json":
        exportToJSON(
          dataToExport,
          `market-data-${new Date().toISOString().split("T")[0]}.json`
        );
        break;
      case "excel":
        exportToExcel(
          dataToExport,
          `market-data-${new Date().toISOString().split("T")[0]}.xlsx`
        );
        break;
      default:
        exportToCSV(dataToExport);
    }
  };

  const handleShareData = async () => {
    const dataToShare =
      bookmarkedCoins.length > 0 ? bookmarkedCoins : filteredAndSortedCoins;
    await shareData(dataToShare, "json");
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  if (loading) return <MarketsSkeleton />;
  if (error) return <Error message={error} />;

  return (
    <div className="max-w-12xl mx-auto">
      {/* Page Header */}
      {/* <PageHeader
        title="Markets"
        subtitle={
          hasActiveSearchOrFilters ? (
            <span>
              <span className="text-blue-600 font-medium">
                {filteredAndSortedCoins.length} of {coins?.length || 0}
              </span>{" "}
              coins found
            </span>
          ) : (
            <span>
              <span className="text-green-600 font-medium">
                {coins?.length || 0}
              </span>{" "}
              coins available
            </span>
          )
        }
        className="mb-6"
      /> */}

      {/* Enhanced Search and Controls */}
      <div
        className="rounded-xl shadow-lg border-2 border-dashed p-4 sm:p-6 mb-6 transition-all duration-300 hover:border-solid hover:shadow-xl"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Performance Quick Access */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Quick Performance Filters:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, performance: "gainers" }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                  filters.performance === "gainers"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300"
                }`}
              >
                🚀 Top Gainers
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, performance: "losers" }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                  filters.performance === "losers"
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                }`}
              >
                📉 Top Losers
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, performance: "stable" }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                  filters.performance === "stable"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
                }`}
              >
                ⚖️ Stable Coins
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, performance: "all" }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                  filters.performance === "all"
                    ? "bg-gray-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-300"
                }`}
              >
                🪙 All Coins
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-6">
            <div className="flex-1 min-w-0">
              <EnhancedSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                coins={coins}
                placeholder="Search coins by name, symbol, or ID..."
                className="w-full"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex-shrink-0">
              <QuickActions
                onExportData={handleExportData}
                onShareData={handleShareData}
                onToggleViewMode={handleToggleViewMode}
                viewMode={viewMode}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                onToggleBookmarks={handleToggleBookmarks}
                showBookmarks={showBookmarks}
              />
            </div>
          </div>

          {/* Debug Button - Temporary */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                console.log("=== DEBUG INFO ===");
                console.log("All coins:", coins?.length);
                console.log("Filters:", filters);
                console.log("Search term:", searchTerm);
                console.log("Filtered coins:", filteredAndSortedCoins?.length);
                console.log("Sample coin data:", coins?.[0]);
                console.log("Price ranges:", getPriceRanges());
                console.log("Market cap ranges:", getMarketCapRanges());
                console.log("Volume ranges:", getVolumeRanges());

                // Test specific filters
                if (filters.priceRange) {
                  console.log("Price filter test:", {
                    filter: filters.priceRange,
                    coinsInRange: coins?.filter(
                      (coin) =>
                        coin.current_price >= filters.priceRange.min &&
                        coin.current_price <= filters.priceRange.max
                    ).length,
                  });
                }

                if (filters.marketCap) {
                  console.log("Market cap filter test:", {
                    filter: filters.marketCap,
                    coinsInRange: coins?.filter(
                      (coin) =>
                        coin.market_cap >= filters.marketCap.min &&
                        coin.market_cap <= filters.marketCap.max
                    ).length,
                  });
                }

                if (filters.volume) {
                  console.log("Volume filter test:", {
                    filter: filters.volume,
                    coinsInRange: coins?.filter(
                      (coin) =>
                        coin.total_volume >= filters.volume.min &&
                        coin.total_volume <= filters.volume.max
                    ).length,
                  });
                }
              }}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 shadow-md hover:shadow-lg"
            >
              Debug Info
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls Section */}
      <div className="w-full mb-6">
        <div className="space-y-4">
          {/* Advanced Filters */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            coins={coins}
          />

          {/* Active Filters Display */}
          {hasActiveSearchOrFilters && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 flex-wrap">
                <FiFilter className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="flex flex-wrap items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800/50 rounded-md">
                      <span>Search: "{searchTerm}"</span>
                    </span>
                  )}
                  {filters.category !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800/50 rounded-md">
                      <span>Category: {filters.category}</span>
                    </span>
                  )}
                  {filters.priceRange && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800/50 rounded-md">
                      <span>Price: {filters.priceRange.label}</span>
                    </span>
                  )}
                  {filters.marketCap && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800/50 rounded-md">
                      <span>Market Cap: {filters.marketCap.label}</span>
                    </span>
                  )}
                  {filters.volume && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-800/50 rounded-md">
                      <span>Volume: {filters.volume.label}</span>
                    </span>
                  )}
                  {filters.performance !== "all" && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium ${
                        filters.performance === "gainers"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : filters.performance === "losers"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      <span className="text-xs">
                        {filters.performance === "gainers"
                          ? "🚀"
                          : filters.performance === "losers"
                          ? "📉"
                          : "⚖️"}
                      </span>
                      <span>
                        {filters.performance === "gainers"
                          ? "Top Gainers"
                          : filters.performance === "losers"
                          ? "Top Losers"
                          : filters.performance === "stable"
                          ? "Stable Coins"
                          : "Performance"}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    category: "All",
                    priceRange: null,
                    marketCap: null,
                    volume: null,
                    performance: "all",
                  });
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-800/50 hover:bg-blue-200 dark:hover:bg-blue-700/50 rounded-md transition-colors duration-200 flex-shrink-0"
              >
                <FiX className="w-4 h-4" />
                <span className="hidden sm:inline">Clear all</span>
                <span className="sm:hidden">Clear</span>
              </button>
            </div>
          )}

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left Side - Sorting and Results Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              {/* Sorting Controls */}
              <SortingControls
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />

              {/* Results Count */}
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-md">
                {hasActiveSearchOrFilters ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                    <span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {bookmarkedCoins.length} of{" "}
                        {filteredAndSortedCoins.length}
                      </span>{" "}
                      filtered coins found
                    </span>
                    {showBookmarks && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (
                        {
                          filteredAndSortedCoins.filter((coin) =>
                            isFavorite(coin.id)
                          ).length
                        }{" "}
                        bookmarked)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                    <span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {bookmarkedCoins.length} of {coins?.length || 0}
                      </span>{" "}
                      total coins
                    </span>
                    {showBookmarks && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (
                        {
                          (coins || []).filter((coin) => isFavorite(coin.id))
                            .length
                        }{" "}
                        bookmarked)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - View Mode Toggle */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-center lg:justify-end">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                View Mode:
              </span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    viewMode === "table"
                      ? "bg-green-500 text-white shadow-lg scale-105"
                      : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title="Table View"
                >
                  <FiEye className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">
                    Table
                  </span>
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    viewMode === "card"
                      ? "bg-green-500 text-white shadow-lg scale-105"
                      : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  title="Card View"
                >
                  <FiEyeOff className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">
                    Cards
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {viewMode === "table" ? (
        /* Table View */
        <div
          className="rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--bg-primary)",
          }}
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table
              className="w-full divide-y divide-gray-200"
              style={{
                borderColor: "var(--bg-primary)",
              }}
            >
              <thead
                style={{
                  backgroundColor: "var(--bg-primary)",
                }}
              >
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    #
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    Coin
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    State
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    Price
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    1h
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    24h
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    7d
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    30d
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    24h Volume
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    Market Cap
                  </th>
                  <th
                    className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  backgroundColor: "var(--bg-card)",
                }}
              >
                {bookmarkedCoins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="transition-colors"
                    style={{
                      borderBottomColor: "var(--bg-primary)",
                    }}
                  >
                    <td
                      className="px-6 py-4 text-sm font-medium"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{index + 1}</span>
                        <StarIcon
                          className={`w-4 h-4 cursor-pointer ${
                            isFavorite(coin.id)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                          onClick={() => toggleFavorite(coin)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {coin.image ? (
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : (
                            coin.symbol?.charAt(0) || "?"
                          )}
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/coin/${coin.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            <div
                              className="text-sm font-medium"
                              style={{
                                color: "var(--text-primary)",
                              }}
                            >
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-center font-medium"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600">
                        Buy
                      </button>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-center font-medium"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {formatPrice(coin.current_price)}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-center font-medium ${getPercentageColor(
                        coin.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      <div className="flex items-center space-y-1">
                        <span className="font-medium">
                          {coin.price_change_percentage_1h_in_currency?.toFixed(
                            1
                          ) || "0"}
                          %
                        </span>
                        <span className="text-xs">
                          {getPercentageIcon(
                            coin.price_change_percentage_1h_in_currency
                          )}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-center font-medium ${getPercentageColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      <div className="flex items-center space-y-1">
                        <span className="font-medium">
                          {coin.price_change_percentage_24h?.toFixed(1) || "0"}%
                        </span>
                        <span className="text-xs">
                          {getPercentageIcon(coin.price_change_percentage_24h)}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-center font-medium ${getPercentageColor(
                        coin.price_change_percentage_7d_in_currency
                      )}`}
                    >
                      <div className="flex items-center space-y-1">
                        <span className="font-medium">
                          {coin.price_change_percentage_7d_in_currency?.toFixed(
                            1
                          ) || "0"}
                          %
                        </span>
                        <span className="text-xs">
                          {getPercentageIcon(
                            coin.price_change_percentage_7d_in_currency
                          )}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-center font-medium ${getPercentageColor(
                        coin.price_change_percentage_30d_in_currency
                      )}`}
                    >
                      <div className="flex items-center space-y-1">
                        <span className="font-medium">
                          {coin.price_change_percentage_30d_in_currency?.toFixed(
                            1
                          ) || "0"}
                          %
                        </span>
                        <span className="text-xs">
                          {getPercentageIcon(
                            coin.price_change_percentage_30d_in_currency
                          )}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-center"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-center"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <Sparkline
                          data={coin.sparkline_in_7d?.price || []}
                          color={
                            coin.price_change_percentage_7d_in_currency >= 0
                              ? "#10B981"
                              : "#EF4444"
                          }
                          width={150}
                          height={40}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="lg:hidden">
            <div
              className="overflow-x-auto"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <table
                className="w-full divide-y divide-gray-200"
                style={{
                  borderColor: "var(--bg-primary)",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "var(--bg-primary)",
                  }}
                >
                  <tr>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      #
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      Coin
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      Price
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      24h
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      Volume
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  {bookmarkedCoins.map((coin, index) => (
                    <tr
                      key={coin.id}
                      className="transition-colors"
                      style={{
                        borderBottomColor: "var(--bg-primary)",
                      }}
                    >
                      <td
                        className="px-3 py-3 whitespace-nowrap text-sm font-medium"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{index + 1}</span>
                          <StarIcon
                            className={`w-4 h-4 cursor-pointer ${
                              isFavorite(coin.id)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                            onClick={() => toggleFavorite(coin)}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{
                              backgroundColor: "var(--bg-primary)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {coin.image ? (
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : (
                              coin.symbol?.charAt(0) || "?"
                            )}
                          </div>
                          <Link
                            to={`/coin/${coin.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            <div
                              className="text-sm font-medium"
                              style={{
                                color: "var(--text-primary)",
                              }}
                            >
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td
                        className="px-3 py-3 whitespace-nowrap text-sm font-medium"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatPrice(coin.current_price)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            coin.price_change_percentage_24h > 0
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {getPercentageIcon(coin.price_change_percentage_24h)}
                          {coin.price_change_percentage_24h?.toFixed(1) || "0"}%
                        </span>
                      </td>
                      <td
                        className="px-3 py-3 whitespace-nowrap text-sm"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {formatVolume(coin.total_volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Card View */
        <CoinCardView
          coins={bookmarkedCoins}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      )}

      {/* No Results Message */}
      {bookmarkedCoins.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {showBookmarks
              ? "No bookmarked coins found. Try adjusting your filters or search terms."
              : hasActiveSearchOrFilters
              ? "No coins found matching your criteria. Try adjusting your filters or search terms."
              : "No coins available at the moment."}
          </div>
          {hasActiveSearchOrFilters && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current filters:{" "}
                <span className="font-medium">
                  {filters.priceRange && `${filters.priceRange.label}`}
                  {filters.marketCap && ` • ${filters.marketCap.label}`}
                  {filters.volume && ` • ${filters.volume.label}`}
                  {filters.category !== "All" && ` • ${filters.category}`}
                  {filters.performance !== "all" && ` • ${filters.performance}`}
                  {searchTerm && ` • Search: "${searchTerm}"`}
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({
                    category: "All",
                    priceRange: null,
                    marketCap: null,
                    volume: null,
                    performance: "all",
                  });
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Markets;
