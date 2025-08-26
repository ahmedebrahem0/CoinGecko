import React, { useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import { FaWater } from "react-icons/fa";

const PoolsCard = ({ title, pools, loading, error, onPoolClick }) => {
  const [selectedPool, setSelectedPool] = useState(null);

  // Debug: طباعة البيانات للتأكد
  console.log(`${title} - Pools data:`, pools);
  console.log(`${title} - Loading:`, loading);
  console.log(`${title} - Error:`, error);

  if (loading) {
    return (
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Error loading pools: {error}</p>
        </div>
      </div>
    );
  }

  // تأكد من أن pools array
  const poolsList = Array.isArray(pools) ? pools : [];

  if (poolsList.length === 0) {
    return (
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center text-light-text dark:text-dark-text">
          <FaWater className="mx-auto text-4xl mb-2 text-gray-300 dark:text-gray-600" />
          <p>No pools available</p>
          <p className="text-xs mt-1">Try searching for a specific token</p>
        </div>
      </div>
    );
  }

  const formatVolume = (volume) => {
    if (!volume || volume === 0) return "$0.00";
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const formatPercentage = (percentage) => {
    if (!percentage && percentage !== 0) return "0.00%";
    const value = parseFloat(percentage);
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
          {title}
        </h3>
        <FaWater className="text-blue-500 dark:text-blue-400 text-xl" />
      </div>

      <div className="space-y-3">
        {poolsList.slice(0, 5).map((pool, index) => (
          <div
            key={pool.id || index}
            className="flex items-center justify-between p-3 bg-light-background dark:bg-dark-background rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedPool(pool);
              onPoolClick && onPoolClick(pool);
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                  {index + 1}
                </span>
              </div>
              <div>
                <div className="font-medium text-light-text dark:text-dark-text">
                  {pool.base_token_symbol || "TOKEN"}/
                  {pool.quote_token_symbol || "USDC"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {pool.dex_id || "Unknown DEX"} •{" "}
                  {pool.network_id || "Unknown Network"}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2">
                <FiDollarSign className="text-green-500 dark:text-green-400" />
                <span className="font-medium text-light-text dark:text-dark-text">
                  {formatVolume(pool.volume_24h)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                {(pool.price_change_percentage_24h || 0) >= 0 ? (
                  <FiTrendingUp className="text-green-500 dark:text-green-400 mr-1" />
                ) : (
                  <FiTrendingDown className="text-red-500 dark:text-red-400 mr-1" />
                )}
                <span
                  className={
                    (pool.price_change_percentage_24h || 0) >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {formatPercentage(pool.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {poolsList.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
            View more ({poolsList.length - 5} more pools)
          </button>
        </div>
      )}
    </div>
  );
};

export default PoolsCard;
