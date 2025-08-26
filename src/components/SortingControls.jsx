import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { getSortingOptions } from "../constant/marketsCoin";

const SortingControls = ({ sortConfig, onSortChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sortingOptions = getSortingOptions();

  const handleSort = (field) => {
    let direction = "desc";

    // If clicking the same field, toggle direction
    if (sortConfig.field === field) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    onSortChange({ field, direction });
    setIsOpen(false);
  };

  const getCurrentSortLabel = () => {
    if (!sortConfig.field) return "Sort by";

    const option = sortingOptions.find((opt) => opt.value === sortConfig.field);
    return option ? option.label : "Sort by";
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return null;

    return sortConfig.direction === "asc" ? (
      <FiArrowUp className="w-4 h-4 text-green-500" />
    ) : (
      <FiArrowDown className="w-4 h-4 text-green-500" />
    );
  };

  const clearSort = () => {
    onSortChange({ field: null, direction: null });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        {/* Sort Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center space-x-2 px-4 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium transition-all duration-300 hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center space-x-2">
            <FiArrowUp className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
            <span className="hidden sm:inline">{getCurrentSortLabel()}</span>
            <span className="sm:hidden">Sort</span>
          </div>

          {/* Direction Indicator */}
          {sortConfig.field && (
            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold">
              {sortConfig.direction === "asc" ? "↑" : "↓"}
            </div>
          )}

          {/* Expand/Collapse Icon */}
          <div className="ml-2 transition-transform duration-200">
            {isOpen ? (
              <FiChevronUp className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
            ) : (
              <FiChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
            )}
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
        </button>

        {/* Clear Sort Button */}
        {sortConfig.field && (
          <button
            onClick={clearSort}
            className="px-3 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <FiArrowUp className="w-4 h-4 inline mr-1" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Sort Options Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 right-0 mt-3 w-64 border-2 border-gray-200 rounded-xl shadow-2xl backdrop-blur-sm"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Dropdown Header */}
          <div
            className="px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 border-b-2 border-gray-200 rounded-t-xl"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sort Options
              </span>
              <span className="text-xs text-gray-500">Click to sort</span>
            </div>
          </div>

          {/* Sort Options List */}
          <div className="py-2 max-h-80 overflow-y-auto">
            {sortingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 hover:scale-[1.02] group"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {option.icon}
                  </span>
                  <span className="font-medium">{option.label}</span>
                </div>

                {/* Current Sort Indicator */}
                <div className="flex items-center space-x-2">
                  {getSortIcon(option.value)}

                  {/* Hover Hint */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs text-gray-500">
                      {sortConfig.field === option.value
                        ? sortConfig.direction === "asc"
                          ? "Ascending"
                          : "Descending"
                        : "Click to sort"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Dropdown Footer */}
          <div
            className="px-4 py-3 border-t-2 border-gray-200 rounded-b-xl"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            <div className="text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center space-x-2">
                <FiArrowUp className="w-3 h-3" />
                <span>Click same field to toggle direction</span>
                <FiArrowDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingControls;
