import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { FaFire, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getSearchSuggestions } from "../constant/marketsCoin";

const EnhancedSearch = ({
  searchTerm,
  onSearchChange,
  coins,
  placeholder = "Search coins...",
  className = "",
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const suggestions = getSearchSuggestions(coins, searchTerm, 8);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleSuggestionClick(suggestions[focusedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (coin) => {
    onSearchChange(coin.symbol || coin.name);
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const clearSearch = () => {
    onSearchChange("");
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const getPerformanceIcon = (percentage) => {
    if (!percentage && percentage !== 0) return null;
    return percentage >= 0 ? (
      <FiTrendingUp className="w-3 h-3 text-green-500" />
    ) : (
      <FiTrendingDown className="w-3 h-3 text-red-500" />
    );
  };

  const getCategoryIcon = (categories) => {
    if (!categories || !Array.isArray(categories)) return null;

    if (categories.some((cat) => cat.toLowerCase().includes("meme"))) {
      return <FaFire className="w-3 h-3 text-orange-500" />;
    }
    return null;
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200 group"
          >
            <div className="p-1 rounded-full bg-gray-100 group-hover:bg-red-100 transition-colors">
              <FiX className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* Search Hint */}
        {!searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full border border-gray-200">
              Press Enter to search
            </div>
          </div>
        )}
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-3 border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto backdrop-blur-sm"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Suggestions Header */}
          <div
            className="sticky top-0 px-4 py-3 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200 rounded-t-xl"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Found {suggestions.length} results
              </span>
              <span className="text-xs text-gray-500">
                Use ↑↓ arrows, Enter to select
              </span>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="py-2">
            {suggestions.map((coin, index) => (
              <div
                key={coin.id}
                className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  index === focusedIndex
                    ? "bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                } ${index === 0 ? "rounded-t-lg" : ""} ${
                  index === suggestions.length - 1 ? "rounded-b-lg" : ""
                }`}
                onClick={() => handleSuggestionClick(coin)}
                onMouseEnter={() => setFocusedIndex(index)}
                style={{
                  borderLeftColor:
                    index === focusedIndex ? "#3B82F6" : "transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Coin Icon */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {coin.image ? (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : (
                        coin.symbol?.charAt(0) || "?"
                      )}
                    </div>

                    {/* Coin Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className="font-semibold truncate"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          {coin.name}
                        </span>
                        {getCategoryIcon(coin.categories)}
                      </div>
                      <div
                        className="text-sm font-mono"
                        style={{
                          color: "var(--text-secondary)",
                        }}
                      >
                        {coin.symbol?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Price and Performance */}
                  <div className="text-right ml-4 min-w-0">
                    <div
                      className="font-bold text-lg mb-1"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      ${coin.current_price?.toFixed(4) || "N/A"}
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {getPerformanceIcon(coin.price_change_percentage_24h)}
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          coin.price_change_percentage_24h >= 0
                            ? "text-green-600 bg-green-100"
                            : "text-red-600 bg-red-100"
                        }`}
                      >
                        {coin.price_change_percentage_24h?.toFixed(1) || "0"}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Results Link */}
          <div
            className="px-4 py-4 border-t-2 border-gray-200 rounded-b-xl"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-primary)",
            }}
          >
            <Link
              to={`/markets?search=${encodeURIComponent(searchTerm)}`}
              className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <FiSearch className="w-4 h-4" />
                <span>
                  View all {suggestions.length} results for "{searchTerm}"
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions &&
        searchTerm.length >= 2 &&
        suggestions.length === 0 && (
          <div
            className="absolute z-50 w-full mt-3 p-4 border-2 border-gray-200 rounded-xl shadow-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="text-center">
              <FiSearch className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                No coins found matching "{searchTerm}"
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Try a different search term
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default EnhancedSearch;
