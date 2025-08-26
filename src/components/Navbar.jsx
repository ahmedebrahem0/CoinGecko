import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSettings,
  FiUser,
  FiSmartphone,
  FiSearch,
  FiTrendingDown,
  FiMenu,
  FiSun,
  FiMoon,
  FiAlertTriangle,
} from "react-icons/fi";
import { FaCandyCane, FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { GiGecko } from "react-icons/gi";
import { useGlobalStats } from "../hooks/useGlobalStats";
import { usePortfolio } from "../context/PortfolioContext";
import { FiStar } from "react-icons/fi";
import { getPercentageColor, getPercentageIcon } from "../constant/marketsCoin";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { globalStats, loading, error, refetch } = useGlobalStats();
  const { favorites, toggleFavorite } = usePortfolio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const favoritesCount = favorites.length;
  const topFavorite = useMemo(() => favorites[0], [favorites]);
  const { theme, toggleTheme } = useTheme();

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      let direction = "asc";
      if (prevSortConfig.key === key && prevSortConfig.direction === "asc") {
        direction = "desc";
      }
      return { key, direction };
    });
  };

  const getFilteredAndSortedFavorites = useMemo(() => {
    let sortableFavorites = [...favorites];
    if (sortConfig.key) {
      sortableFavorites.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
      });
    }
    return sortableFavorites;
  }, [favorites, sortConfig]);

  return (
    <>
      {/* Global Market Data Bar */}
      <div
        className="border-b border-gray-200 dark:border-gray-600"
        style={{
          backgroundColor: "var(--bg-card)",
        }}
      >
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-1">
            <div className="flex items-center justify-center text-xs text-yellow-800 dark:text-yellow-200">
              <FiAlertTriangle className="w-3 h-3 mr-1" />
              API Connection Issue - Some data may be unavailable
              <button
                onClick={refetch}
                disabled={loading}
                className="ml-2 px-2 py-0.5 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? "Retrying..." : "Retry"}
              </button>
            </div>
          </div>
        )}
        <div
          className="text-xs py-2 px-4"
          style={{
            color: "var(--text-primary)",
          }}
        >
          <div className="flex justify-evenly items-center space-x-6">
            <div className="flex items-center space-x-4 md:space-x-6">
              <p className="text-gray-500 dark:text-gray-300 whitespace-nowrap">
                Coins:{" "}
                <span
                  className="hover:cursor-pointer font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {loading
                    ? "..."
                    : globalStats?.data?.active_cryptocurrencies
                    ? globalStats.data.active_cryptocurrencies.toLocaleString()
                    : "0"}
                </span>
              </p>

              <p className="text-gray-500 dark:text-gray-300 whitespace-nowrap">
                Exchanges:{" "}
                <span
                  className="hover:cursor-pointer font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {loading
                    ? "..."
                    : globalStats?.data?.markets
                    ? globalStats.data.markets.toLocaleString()
                    : "0"}
                </span>
              </p>

              <p className="text-gray-500 dark:text-gray-300 flex whitespace-nowrap">
                Market Cap:
                <span
                  className="hover:cursor-pointer font-semibold ml-0.5"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {"$ "}
                  {loading
                    ? "..."
                    : globalStats?.data?.total_market_cap?.usd
                    ? (globalStats.data.total_market_cap.usd / 1e12).toFixed(2)
                    : "0.00"}
                  {"T"}
                </span>
                <span className="hover:cursor-pointer text-red-500 font-semibold mx-1.5 flex items-center">
                  {loading
                    ? "..."
                    : globalStats?.data?.market_cap_change_percentage_24h_usd
                    ? globalStats.data.market_cap_change_percentage_24h_usd.toFixed(
                        2
                      )
                    : "0.00"}
                  %
                  <FiTrendingDown className="ml-1 w-3 h-3" />
                </span>
              </p>

              <p className="text-gray-500 dark:text-gray-300 whitespace-nowrap">
                24h Vol:{" "}
                <span
                  className="hover:cursor-pointer font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  $
                  {loading
                    ? "..."
                    : globalStats?.data?.total_volume?.usd
                    ? (globalStats.data.total_volume.usd / 1e9).toFixed(2)
                    : "0.00"}
                  B
                </span>
              </p>

              <p className="text-gray-500 dark:text-gray-300 whitespace-nowrap">
                Dominance:{" "}
                <span
                  className="hover:cursor-pointer font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  BTC{" "}
                  {loading
                    ? "..."
                    : globalStats?.data?.market_cap_percentage?.btc
                    ? globalStats.data.market_cap_percentage.btc.toFixed(2) +
                      "%"
                    : "N/A"}
                </span>
                <span
                  className="hover:cursor-pointer font-semibold ml-1"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  ETH{" "}
                  {loading
                    ? "..."
                    : globalStats?.data?.market_cap_percentage?.eth
                    ? globalStats.data.market_cap_percentage.eth.toFixed(2) +
                      "%"
                    : "N/A"}
                </span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Gas:{" "}
                <span
                  className="hover:cursor-pointer font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  0.613 GWEI ⚡
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <nav
        className="shadow-sm border-b border-gray-200 dark:border-gray-700"
        style={{
          backgroundColor: "var(--bg-card)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <GiGecko className="text-green-600 text-lg" />
                </div>
                <span
                  className="text-xl font-bold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  coingecko
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link
                to="/markets"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                {/* Cryptocurrencies */}
              </Link>
              <Link
                to="/highlights"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Highlights
              </Link>
              <Link
                to="/pools"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Pools
              </Link>
              <a
                href="/exchanges"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Exchanges
              </a>
              <a
                href="/nfts"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                NFT
              </a>
              <a
                href="#"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Learn
              </a>
              <a
                href="#"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Products
              </a>
              <a
                href="#"
                className="font-medium hover:opacity-80 transition-opacity"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                API
              </a>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 md:space-x-4 relative">
              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                  <FaCandyCane className="w-4 h-4" />
                  <span className="font-medium">Candy</span>
                </button>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md hover:bg-opacity-20 transition-colors cursor-pointer"
                  style={{
                    color: "var(--text-primary)",
                    backgroundColor: "rgba(0,0,0,0.1)",
                  }}
                >
                  {theme === "light" ? (
                    <FiMoon className="w-5 h-5" />
                  ) : (
                    <FiSun className="w-5 h-5" />
                  )}
                </button>
                {/* Portfolio Dropdown */}
                <div className="relative ">
                  <button
                    onClick={() => setIsPortfolioOpen((v) => !v)}
                    className="cursor-pointer flex items-center space-x-2 px-2 py-2 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 dark:bg-yellow-800 dark:border-yellow-700 dark:hover:bg-yellow-700"
                  >
                    <FiStar className="text-yellow-500 w-4 h-4" />

                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {favoritesCount}
                    </span>
                  </button>
                  {isPortfolioOpen && (
                    <div
                      className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      style={{
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-card)",
                      }}
                    >
                      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <FiStar className="text-yellow-500" />
                          <span className="font-semibold text-light-text dark:text-dark-text">
                            My Portfolio
                          </span>
                        </div>
                        <Link
                          to="/highlights"
                          className="text-xs text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                          style={{
                            color: "var(--text-card)",
                          }}
                        >
                          View more
                        </Link>
                      </div>
                      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-start space-x-3 dark:border-gray-700 ">
                        <span className="text-xs text-gray-500 font-medium dark:text-gray-400">
                          Sort By:
                        </span>
                        <div className="flex items-center space-x-2 text-xs font-medium">
                          <span
                            className={`cursor-pointer hover:text-light-accent focus:bg-light-background border border-gray-200 rounded-md px-2 py-1 ${
                              sortConfig.key === "name"
                                ? "text-light-text  dark:text-whit"
                                : "text-gray-500  dark:hover:text-gray-700"
                            }`}
                            onClick={() => handleSort("name")}
                          >
                            Name
                          </span>
                          <span
                            className={`cursor-pointer hover:text-light-accent border-1 border-gray-200 rounded-md px-2 py-1 ${
                              sortConfig.key === "current_price"
                                ? "text-light-text  dark:text-whit"
                                : "text-gray-500  dark:hover:text-gray-700"
                            }`}
                            onClick={() => handleSort("current_price")}
                          >
                            Price
                            {sortConfig.key === "current_price" && ""}
                          </span>
                          <span
                            className={`cursor-pointer hover:text-light-accent border-1 border-gray-200 rounded-md px-2 py-1 ${
                              sortConfig.key === "price_change_percentage_24h"
                                ? "text-light-text  dark:text-whit"
                                : "text-gray-500  dark:hover:text-gray-700"
                            }`}
                            onClick={() =>
                              handleSort("price_change_percentage_24h")
                            }
                          >
                            24h Change
                            {sortConfig.key === "price_change_percentage_24h" &&
                              ""}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 space-y-2 max-h-80 overflow-auto">
                        {favoritesCount === 0 && (
                          <div className="text-sm text-gray-500 text-center py-4 dark:text-gray-300">
                            No favorites yet. Click stars to add coins.
                          </div>
                        )}
                        {getFilteredAndSortedFavorites.map((coin) => (
                          <div
                            key={coin.id}
                            className="flex items-center justify-between hover:bg-light-background p-3 rounded-lg border border-gray-200 shadow-sm transition-all duration-200 dark:hover:bg-gray-700 dark:border-gray-600"
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                              <span className="text-sm text-light-text font-medium dark:text-white">
                                {coin.name}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-sm text-light-text font-semibold dark:text-white">
                                {coin.current_price
                                  ? `$${coin.current_price.toFixed(2)}`
                                  : "--"}
                              </div>
                              <div
                                className={`text-xs ${getPercentageColor(
                                  coin.price_change_percentage_24h
                                )}`}
                              >
                                <div className="flex items-center space-x-1">
                                  {getPercentageIcon(
                                    coin.price_change_percentage_24h
                                  )}
                                  {coin.price_change_percentage_24h?.toFixed(2)}
                                  %
                                </div>
                              </div>
                            </div>
                            <MdDelete
                              className="w-4 h-4 cursor-pointer text-green-500 hover:text-red-500 duration-300 hover:scale-110"
                              onClick={() => toggleFavorite(coin)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-48 md:w-64 px-4 py-2 bg-light-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiSearch className="w-4 h-4" />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-md text-light-text hover:text-light-accent hover:bg-light-background dark:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-600">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/markets"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  Cryptocurrencies
                </Link>
                <Link
                  to="/highlights"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  Highlights
                </Link>
                <Link
                  to="/pools"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  Pools
                </Link>
                <a
                  href="/exchanges"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  Exchanges
                </a>
                <a
                  href="/nfts"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  NFT
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  Learn
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  Products
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-light-text hover:text-light-accent hover:bg-light-background rounded-md dark:text-white dark:hover:bg-gray-700"
                >
                  API
                </a>

                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full px-4 py-2 bg-light-background rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FiSearch className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Mobile Buttons */}
                <div className="px-3 py-2 space-y-2">
                  <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 w-full px-3 py-2 hover:bg-light-background rounded-md">
                    <FaCandyCane className="w-4 h-4" />
                    <span className="font-medium">Candy</span>
                  </button>
                  {/* Mobile Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 text-light-text hover:text-light-accent w-full px-3 py-2 hover:bg-light-background rounded-md dark:text-dark-text dark:hover:bg-dark-background"
                  >
                    {theme === "light" ? (
                      <FiMoon className="w-5 h-5" />
                    ) : (
                      <FiSun className="w-5 h-5" />
                    )}
                    <span className="font-medium">Theme</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
