import React, { useState } from "react";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
} from "react-icons/fi";
import { FaFire, FaStar, FaChartLine, FaCoins } from "react-icons/fa";
import {
  getPriceRanges,
  getMarketCapRanges,
  getVolumeRanges,
  getPerformanceOptions,
  getUniqueCategories,
} from "../constant/marketsCoin";

const AdvancedFilters = ({
  filters,
  onFiltersChange,
  coins,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("category");

  const priceRanges = getPriceRanges();
  const marketCapRanges = getMarketCapRanges();
  const volumeRanges = getVolumeRanges();
  const performanceOptions = getPerformanceOptions();
  const categories = getUniqueCategories(coins);

  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: "All",
      priceRange: null,
      marketCap: null,
      volume: null,
      performance: "all",
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.category !== "All" ||
      filters.priceRange ||
      filters.marketCap ||
      filters.volume ||
      filters.performance !== "all"
    );
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.priceRange) count++;
    if (filters.marketCap) count++;
    if (filters.volume) count++;
    if (filters.performance !== "all") count++;
    return count;
  };

  const FilterTab = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-green-500 text-white shadow-lg scale-105"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
      }`}
      style={{
        backgroundColor: isActive ? "#10B981" : "var(--bg-primary)",
        color: isActive ? "white" : "var(--text-primary)",
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(" ")[0]}</span>
    </button>
  );

  const RangeFilter = ({ label, ranges, value, onChange, icon }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium">
        {icon}
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {ranges.map((range, index) => (
          <button
            key={index}
            onClick={() =>
              onChange(
                value?.min === range.min && value?.max === range.max
                  ? null
                  : range
              )
            }
            className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all duration-200 hover:scale-105 ${
              value?.min === range.min && value?.max === range.max
                ? "bg-green-500 text-white border-green-500 shadow-lg"
                : "bg-white border-gray-300 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
            }`}
            style={{
              backgroundColor:
                value?.min === range.min && value?.max === range.max
                  ? "#10B981"
                  : "var(--bg-card)",
              borderColor:
                value?.min === range.min && value?.max === range.max
                  ? "#10B981"
                  : "var(--border-color)",
            }}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
      {/* Header - Clickable Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full group relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg"
        style={{
          borderColor: hasActiveFilters() ? "#10B981" : "var(--border-color)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <FiFilter className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Advanced Filters
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                  {isExpanded
                    ? "Click to collapse"
                    : "Click to expand and filter coins"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Active Filters Count */}
              {hasActiveFilters() && (
                <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full border-2 border-green-300">
                  {getFilterCount()}
                </div>
              )}

              {/* Expand/Collapse Icon */}
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                {isExpanded ? (
                  <FiChevronUp className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Preview */}
          {hasActiveFilters() && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {filters.category !== "All" && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                    <FaCoins className="w-3 h-3" />
                    <span>Category: {filters.category}</span>
                  </span>
                )}
                {filters.priceRange && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1">
                    <FaChartLine className="w-3 h-3" />
                    <span>Price: {filters.priceRange.label}</span>
                  </span>
                )}
                {filters.marketCap && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center space-x-1">
                    <FaCoins className="w-3 h-3" />
                    <span>Market Cap: {filters.marketCap.label}</span>
                  </span>
                )}
                {filters.volume && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center space-x-1">
                    <FiSliders className="w-3 h-3" />
                    <span>Volume: {filters.volume.label}</span>
                  </span>
                )}
                {filters.performance !== "all" && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center space-x-1">
                    <FaStar className="w-3 h-3" />
                    <span>
                      Performance:{" "}
                      {
                        performanceOptions.find(
                          (p) => p.value === filters.performance
                        )?.label
                      }
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          className="mt-4 p-4 sm:p-6 rounded-xl border border-gray-200 shadow-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
            <FilterTab
              id="category"
              label="Categories"
              icon={<FaCoins className="w-4 h-4" />}
              isActive={activeTab === "category"}
              onClick={() => setActiveTab("category")}
            />
            <FilterTab
              id="price"
              label="Price & Market Cap"
              icon={<FaChartLine className="w-4 h-4" />}
              isActive={activeTab === "price"}
              onClick={() => setActiveTab("price")}
            />
            <FilterTab
              id="performance"
              label="Performance"
              icon={<FaStar className="w-4 h-4" />}
              isActive={activeTab === "performance"}
              onClick={() => setActiveTab("performance")}
            />
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {/* Categories Tab */}
            {activeTab === "category" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        handleFilterChange(
                          "category",
                          filters.category === category ? "All" : category
                        )
                      }
                      className={`px-4 py-3 text-sm rounded-lg border transition-all duration-200 hover:scale-105 ${
                        filters.category === category
                          ? "bg-green-500 text-white border-green-500 shadow-lg"
                          : "bg-white border-gray-300 hover:border-green-500 hover:bg-green-50 hover:shadow-md"
                      }`}
                      style={{
                        backgroundColor:
                          filters.category === category
                            ? "#10B981"
                            : "var(--bg-card)",
                        borderColor:
                          filters.category === category
                            ? "#10B981"
                            : "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {category.toLowerCase().includes("meme") && (
                          <FaFire className="w-3 h-3 text-orange-500" />
                        )}
                        <span className="truncate">{category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Market Cap Tab */}
            {activeTab === "price" && (
              <div className="space-y-8">
                <RangeFilter
                  label="Price Range"
                  ranges={priceRanges}
                  value={filters.priceRange}
                  onChange={(value) => handleFilterChange("priceRange", value)}
                  icon={<FaChartLine className="w-4 h-4" />}
                />

                <RangeFilter
                  label="Market Cap Range"
                  ranges={marketCapRanges}
                  value={filters.marketCap}
                  onChange={(value) => handleFilterChange("marketCap", value)}
                  icon={<FaCoins className="w-4 h-4" />}
                />

                <RangeFilter
                  label="Volume Range"
                  ranges={volumeRanges}
                  value={filters.volume}
                  onChange={(value) => handleFilterChange("volume", value)}
                  icon={<FiSliders className="w-4 h-4" />}
                />
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div className="space-y-6">
                {/* Performance Header */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Performance Filters
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Filter coins based on their 24-hour price performance
                  </p>
                </div>

                {/* Performance Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {performanceOptions.map((option) => {
                    const isActive = filters.performance === option.value;
                    const getOptionStyle = () => {
                      switch (option.value) {
                        case "gainers":
                          return {
                            active:
                              "bg-green-500 text-white border-green-500 shadow-lg",
                            inactive:
                              "bg-white border-gray-300 hover:border-green-500 hover:bg-green-50 hover:shadow-md",
                            icon: "🚀",
                            description: "Coins with >5% gain",
                          };
                        case "losers":
                          return {
                            active:
                              "bg-red-500 text-white border-red-500 shadow-lg",
                            inactive:
                              "bg-white border-gray-300 hover:border-red-500 hover:bg-red-50 hover:shadow-md",
                            icon: "📉",
                            description: "Coins with >5% loss",
                          };
                        case "stable":
                          return {
                            active:
                              "bg-blue-500 text-white border-blue-500 shadow-lg",
                            inactive:
                              "bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md",
                            icon: "⚖️",
                            description: "Coins with ±5% change",
                          };
                        default:
                          return {
                            active:
                              "bg-gray-500 text-white border-gray-500 shadow-lg",
                            inactive:
                              "bg-white border-gray-300 hover:border-gray-500 hover:bg-gray-50 hover:shadow-md",
                            icon: "🪙",
                            description: "All available coins",
                          };
                      }
                    };

                    const style = getOptionStyle();

                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleFilterChange("performance", option.value)
                        }
                        className={`px-4 py-4 text-sm rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                          isActive ? style.active : style.inactive
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? option.value === "gainers"
                              ? "#10B981"
                              : option.value === "losers"
                              ? "#EF4444"
                              : option.value === "stable"
                              ? "#3B82F6"
                              : "#6B7280"
                            : "var(--bg-card)",
                          borderColor: isActive
                            ? option.value === "gainers"
                              ? "#10B981"
                              : option.value === "losers"
                              ? "#EF4444"
                              : option.value === "stable"
                              ? "#3B82F6"
                              : "#6B7280"
                            : "var(--border-color)",
                        }}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="text-2xl">{style.icon}</div>
                          <div className="font-semibold">{option.label}</div>
                          <div
                            className={`text-xs ${
                              isActive ? "text-white/80" : "text-gray-500"
                            }`}
                          >
                            {style.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Performance Stats */}
                {filters.performance !== "all" && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="text-center">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Current Performance Filter
                      </h4>
                      <div className="flex items-center justify-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            filters.performance === "gainers"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : filters.performance === "losers"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {
                            performanceOptions.find(
                              (p) => p.value === filters.performance
                            )?.label
                          }
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          •{" "}
                          {coins?.filter((coin) => {
                            if (filters.performance === "gainers") {
                              return coin.price_change_percentage_24h > 5;
                            } else if (filters.performance === "losers") {
                              return coin.price_change_percentage_24h < -5;
                            } else if (filters.performance === "stable") {
                              return (
                                coin.price_change_percentage_24h >= -5 &&
                                coin.price_change_percentage_24h <= 5
                              );
                            }
                            return true;
                          }).length || 0}{" "}
                          coins found
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200"
            style={{
              borderColor: "var(--border-color)",
            }}
          >
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {hasActiveFilters() ? (
                <span className="flex items-center space-x-2">
                  <FiFilter className="w-4 h-4 text-green-600" />
                  <span>Active Filters ({getFilterCount()}):</span>
                </span>
              ) : (
                <span>No active filters</span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 hover:scale-105"
                >
                  <FiX className="w-4 h-4 inline mr-2" />
                  Clear All
                </button>
              )}

              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
