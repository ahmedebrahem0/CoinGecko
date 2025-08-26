import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MarketsSkeleton = () => {
  return (
    <div className="max-w-12xl mx-auto p-4 sm:p-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div
          className="relative overflow-hidden rounded-2xl border-2 border-dashed p-6 sm:p-8"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <Skeleton height={40} width={300} className="mb-3" />
          <Skeleton height={24} width={400} />

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-full blur-xl" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl" />
          </div>
        </div>
      </div>

      {/* Search and Controls Skeleton */}
      <div
        className="rounded-xl border-2 border-dashed p-4 sm:p-6 mb-6 shadow-sm"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar Skeleton */}
          <div className="flex-1">
            <Skeleton height={48} className="rounded-xl" />
          </div>

          {/* Quick Actions Skeleton */}
          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                height={48}
                width={48}
                className="rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div
        className="rounded-xl border-2 border-dashed p-4 sm:p-6 mb-6 shadow-sm"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filter Tabs Skeleton */}
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                height={40}
                width={120}
                className="rounded-lg"
              />
            ))}
          </div>

          {/* Sort Controls Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton height={40} width={160} className="rounded-xl" />
            <Skeleton height={40} width={80} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div
        className="rounded-xl border-2 border-dashed overflow-hidden shadow-lg"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="relative">
          {/* Desktop Table Skeleton */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead
                className="border-b-2 border-gray-200"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <tr>
                  {[
                    "#",
                    "Coin",
                    "State",
                    "Price",
                    "1h",
                    "24h",
                    "7d",
                    "30d",
                    "24h Volume",
                    "Market Cap",
                    "Last 7 Days",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-4 text-left text-sm font-medium uppercase tracking-wider"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      <Skeleton height={20} width={80} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className="divide-y-2 divide-gray-200"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
                  <tr
                    key={row}
                    className="hover:bg-gray-50 transition-colors"
                    style={{
                      borderBottomColor: "var(--border-color)",
                    }}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Skeleton height={20} width={20} />
                        <Skeleton height={20} width={20} circle />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton height={40} width={40} circle />
                        <div>
                          <Skeleton height={20} width={100} className="mb-2" />
                          <Skeleton height={16} width={60} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Skeleton
                        height={32}
                        width={80}
                        className="rounded-full"
                      />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton height={20} width={100} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton height={20} width={60} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton height={20} width={60} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton height={20} width={60} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton height={20} width={60} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton height={20} width={100} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton height={20} width={100} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Skeleton
                        height={40}
                        width={140}
                        className="rounded-lg"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table Skeleton */}
          <div className="lg:hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className="border-b-2 border-gray-200"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <tr>
                    {["#", "Coin", "Price", "24h", "Volume"].map(
                      (header, index) => (
                        <th
                          key={index}
                          className="px-3 py-3 text-left text-sm font-medium uppercase tracking-wider"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          <Skeleton height={18} width={60} />
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody
                  className="divide-y-2 divide-gray-200"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr
                      key={row}
                      className="hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottomColor: "var(--border-color)",
                      }}
                    >
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Skeleton height={18} width={20} />
                          <Skeleton height={18} width={18} circle />
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-3">
                          <Skeleton height={32} width={32} circle />
                          <div>
                            <Skeleton height={18} width={80} className="mb-1" />
                            <Skeleton height={14} width={50} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Skeleton height={18} width={80} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Skeleton height={18} width={50} />
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Skeleton height={18} width={80} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading market data...</span>
        </div>
      </div>
    </div>
  );
};

export default MarketsSkeleton;
