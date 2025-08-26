import React, { useState } from "react";
import {
  FiDownload,
  FiShare2,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiBookmark,
  FiTrendingUp,
  FiAlertCircle,
  FiSettings,
} from "react-icons/fi";
import { FaFire, FaStar, FaChartLine, FaCoins } from "react-icons/fa";

const QuickActions = ({
  onExportData,
  onShareData,
  onToggleViewMode,
  viewMode,
  onRefresh,
  isRefreshing,
  onToggleBookmarks,
  showBookmarks,
  className = "",
}) => {
  const [showTooltip, setShowTooltip] = useState(null);

  const actions = [
    {
      id: "refresh",
      icon: (
        <FiRefreshCw
          className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
      ),
      label: "Refresh Data",
      action: onRefresh,
      disabled: isRefreshing,
      color: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
      bgColor: "bg-blue-100",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      id: "viewMode",
      icon:
        viewMode === "table" ? (
          <FiEye className="w-4 h-4" />
        ) : (
          <FiEyeOff className="w-4 h-4" />
        ),
      label: viewMode === "table" ? "Table View" : "Card View",
      action: onToggleViewMode,
      color: "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
      bgColor: "bg-purple-100",
      hoverBgColor: "hover:bg-purple-200",
    },
    {
      id: "bookmarks",
      icon: <FiBookmark className="w-4 h-4" />,
      label: showBookmarks ? "Hide Bookmarks" : "Show Bookmarks",
      action: onToggleBookmarks,
      color: showBookmarks
        ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
        : "text-gray-600 hover:text-gray-700 hover:bg-gray-50",
      bgColor: showBookmarks ? "bg-yellow-100" : "bg-gray-100",
      hoverBgColor: showBookmarks ? "hover:bg-yellow-200" : "hover:bg-gray-200",
    },
    {
      id: "export",
      icon: <FiDownload className="w-4 h-4" />,
      label: "Export Data",
      action: onExportData,
      color: "text-green-600 hover:text-green-700 hover:bg-green-50",
      bgColor: "bg-green-100",
      hoverBgColor: "hover:bg-green-200",
    },
    {
      id: "share",
      icon: <FiShare2 className="w-4 h-4" />,
      label: "Share Data",
      action: onShareData,
      color: "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50",
      bgColor: "bg-indigo-100",
      hoverBgColor: "hover:bg-indigo-200",
    },
  ];

  const handleActionClick = (action) => {
    if (action.action && !action.disabled) {
      action.action();
    }
  };

  const handleMouseEnter = (actionId) => {
    setShowTooltip(actionId);
  };

  const handleMouseLeave = () => {
    setShowTooltip(null);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-2 ${className}`}
    >
      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
        {actions.map((action) => (
          <div key={action.id} className="relative">
            <button
              onClick={() => handleActionClick(action)}
              onMouseEnter={() => handleMouseEnter(action.id)}
              onMouseLeave={handleMouseLeave}
              disabled={action.disabled}
              className={`group relative p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                action.color
              } ${
                action.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: action.bgColor,
              }}
              title={action.label}
            >
              {/* Icon */}
              <div className="relative z-10">{action.icon}</div>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${action.hoverBgColor}`}
              />

              {/* Active State Indicator */}
              {action.id === "bookmarks" && showBookmarks && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </button>

            {/* Enhanced Tooltip */}
            {showTooltip === action.id && (
              <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-2xl">
                <div className="flex items-center space-x-2">
                  {action.icon}
                  <span className="font-medium">{action.label}</span>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Market Stats Summary */}
      <div
        className="flex-shrink-0 px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm">
          {/* Bull Market Indicator */}
          <div className="flex items-center space-x-2 text-green-600 group">
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
              <FiTrendingUp className="w-4 h-4" />
            </div>
            <span className="font-semibold hidden sm:inline">Bull Market</span>
            <span className="font-semibold sm:hidden">Bull</span>
          </div>

          {/* Hot Coins Indicator */}
          <div className="flex items-center space-x-2 text-orange-500 group">
            <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
              <FaFire className="w-4 h-4" />
            </div>
            <span className="font-semibold hidden sm:inline">Hot</span>
            <span className="font-semibold sm:hidden">Hot</span>
          </div>

          {/* Trending Indicator */}
          <div className="flex items-center space-x-2 text-blue-600 group">
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <FaChartLine className="w-4 h-4" />
            </div>
            <span className="font-semibold hidden sm:inline">Trending</span>
            <span className="font-semibold sm:hidden">Trend</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
