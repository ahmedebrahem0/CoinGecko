import React from "react";
import { Link } from "react-router-dom";
import { FiStar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import Sparkline from "./Sparkline";
import {
  formatPrice,
  formatVolume,
  formatMarketCap,
  getPercentageColor,
  getPercentageIcon,
} from "../constant/marketsCoin";

const CoinCardView = ({
  coins,
  isFavorite,
  toggleFavorite,
  className = "",
}) => {
  const getCategoryIcon = (categories) => {
    if (!categories || !Array.isArray(categories)) return null;

    if (categories.some((cat) => cat.toLowerCase().includes("meme"))) {
      return <FaFire className="w-4 h-4 text-orange-500" />;
    }
    return null;
  };

  const getPerformanceBadge = (percentage) => {
    if (!percentage && percentage !== 0) return null;

    const isPositive = percentage >= 0;
    const bgColor = isPositive
      ? "bg-green-100 dark:bg-green-900"
      : "bg-red-100 dark:bg-red-900";
    const textColor = isPositive
      ? "text-green-800 dark:text-green-200"
      : "text-red-800 dark:text-red-200";

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {getPercentageIcon(percentage)}
        <span className="ml-1">{percentage.toFixed(1)}%</span>
      </span>
    );
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 ${className}`}
    >
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="group border-2 border-dashed rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-solid hover:scale-[1.02]"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Card Header */}
          <div
            className="p-3 sm:p-4 border-b-2 border-dashed"
            style={{
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {coin.image ? (
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    coin.symbol?.charAt(0) || "?"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <h3
                      className="font-semibold truncate text-sm sm:text-base"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {coin.name}
                    </h3>
                    {getCategoryIcon(coin.categories)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {coin.symbol?.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFavorite(coin.id)}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                  isFavorite(coin.id)
                    ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20"
                    : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                }`}
              >
                <FiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Price and Performance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-lg sm:text-xl font-bold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {formatPrice(coin.current_price)}
                </span>
                {getPerformanceBadge(coin.price_change_percentage_24h)}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    Market Cap
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 truncate">
                    {formatMarketCap(coin.market_cap)}
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    Volume
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 truncate">
                    {formatVolume(coin.total_volume)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="p-3 sm:p-4">
            <div className="mb-3">
              <Sparkline
                data={coin.sparkline_in_7d?.price}
                color={
                  coin.price_change_percentage_24h >= 0 ? "#10B981" : "#EF4444"
                }
                width="100%"
                height={40}
                showGrid={false}
                showTooltip={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Link
                to={`/coin/${coin.id}`}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">Details</span>
              </Link>

              <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md">
                <span className="hidden sm:inline">Trade</span>
                <span className="sm:hidden">Trade</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoinCardView;
