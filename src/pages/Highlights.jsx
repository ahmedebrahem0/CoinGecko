import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { FiStar as StarIcon } from "react-icons/fi";
import { FiTrendingUp, FiTrendingDown, FiStar } from "react-icons/fi";
import {
  FaFire,
  FaRocket,
  FaBell,
  FaStar,
  FaLock,
  FaEye,
  FaTrophy,
  FaCalendar,
  // FaTrendingUp,
} from "react-icons/fa";
import { GiTrophyCup, GiShoppingBag } from "react-icons/gi";
import {
  getTopCoins,
  getTrendingCoins,
  getRecentlyAddedCoins,
} from "../services/marketService";
import PageHeader from "../components/PageHeader";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Breadcrumb from "../components/Breadcrumb";
import Sparkline from "./../components/Sparkline";
import {
  formatVolume,
  formatPrice,
  formatMarketCap,
  filteredCoins,
  getPercentageColor,
  getPercentageIcon,
  // getCoinIcon,
} from "../constant/marketsCoin";

const Highlights = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [newCoins, setNewCoins] = useState([]);
  const [tokenUnlocks, setTokenUnlocks] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [highestVolume, setHighestVolume] = useState([]);
  const [priceChangeATH, setPriceChangeATH] = useState([]);
  const [mostVoted, setMostVoted] = useState([]);
  const [upcomingCoins, setUpcomingCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Routing-driven section selection
  const sectionMap = {
    trending: "Trending Coins",
    "top-gainers": "Top Gainers",
    "top-losers": "Top Losers",
    "new-coins": "New Coins",
    "most-viewed": "Most Viewed",
    "highest-volume": "Highest Volume",
    "ath-change": "Price Change since ATH (%)",
    "most-voted": "Most Voted Coins",
    upcoming: "Upcoming Coins",
  };
  const titleToSlugMap = Object.fromEntries(
    Object.entries(sectionMap).map(([slug, title]) => [title, slug])
  );
  const { section } = useParams();
  const navigate = useNavigate();
  const currentCard = section ? sectionMap[section] || null : null;
  const { isFavorite, toggleFavorite } = usePortfolio();

  const handleBackToHighlights = () => {
    navigate("/highlights");
  };

  // Format volume function
  const formatVolume = (volume) => {
    if (!volume || volume === 0) {
      return "N/A";
    }

    // Handle string values like "$244,338"
    if (typeof volume === "string") {
      return volume;
    }

    if (volume >= 1e12) {
      return `$${(volume / 1e12).toFixed(1)}T`;
    } else if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(1)}M`;
    } else {
      return `$${volume.toLocaleString()}`;
    }
  };

  // Format market cap function
  const formatMarketCap = (marketCap) => {
    if (!marketCap || marketCap === 0) {
      return "N/A";
    }

    // Handle string values like "$79,628,927"
    if (typeof marketCap === "string") {
      return marketCap;
    }

    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(1)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  // No local reset needed; routing controls current section

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch sequentially to reduce rate usage and avoid bursts
        const trendingData = await getTrendingCoins();
        const topCoinsData = await getTopCoins(100);

        console.log("Trending Data:", trendingData);

        // Fix: trendingData has a nested structure, we need to extract the coins array and map it to match our expected format
        if (trendingData && trendingData.coins) {
          const formattedTrendingCoins = trendingData.coins.map((coinData) => {
            // Find matching coin in topCoinsData to get additional data
            const matchingCoin = topCoinsData.find(
              (topCoin) => topCoin.id === coinData.item.id
            );

            return {
              id: coinData.item.id,
              name: coinData.item.name,
              symbol: coinData.item.symbol,
              image: coinData.item.large,
              sparkline: coinData.item.data.sparkline,
              current_price: coinData.item.data?.price || 0,
              price_change_percentage_24h:
                coinData.item.data?.price_change_percentage_24h?.usd || 0,
              // Get additional data from topCoinsData if available
              price_change_percentage_1h_in_currency:
                matchingCoin?.price_change_percentage_1h_in_currency || 0,
              price_change_percentage_7d_in_currency:
                matchingCoin?.price_change_percentage_7d_in_currency || 0,
              price_change_percentage_30d_in_currency:
                matchingCoin?.price_change_percentage_30d_in_currency || 0,
              total_volume:
                coinData.item.data?.total_volume ||
                matchingCoin?.total_volume ||
                0,
              market_cap:
                coinData.item.data?.market_cap || matchingCoin?.market_cap || 0,
              market_cap_rank: matchingCoin?.market_cap_rank || null,
              sparkline_in_7d: matchingCoin?.sparkline_in_7d || { price: [] },
            };
          });
          setTrendingCoins(formattedTrendingCoins);
          console.log("Formatted Trending Coins:", formattedTrendingCoins);
        } else {
          setTrendingCoins([]);
        }

        // Get upcoming coins from top coins (coins ranked 50-100)
        const upcomingCoinsData = topCoinsData
          .filter((coin) => coin.market_cap_rank && coin.market_cap_rank > 50)
          .slice(0, 8);

        const gainers = topCoinsData
          .filter(
            (coin) =>
              coin.price_change_percentage_24h &&
              coin.price_change_percentage_24h > 0
          )
          .sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h
          )
          .slice(0, 8);

        setTopGainers(gainers);

        const losers = topCoinsData
          .filter(
            (coin) =>
              coin.price_change_percentage_24h &&
              coin.price_change_percentage_24h < 0
          )
          .sort(
            (a, b) =>
              a.price_change_percentage_24h - b.price_change_percentage_24h
          )
          .slice(0, 8);

        setTopLosers(losers);

        // Set recently added coins data (using upcoming coins data)
        setNewCoins(upcomingCoinsData);

        // Get highest volume coins
        const highestVolumeCoins = topCoinsData
          .sort((a, b) => b.total_volume - a.total_volume)
          .slice(0, 8);
        setHighestVolume(highestVolumeCoins);

        // Get coins with biggest drop from ATH
        const athDropCoins = topCoinsData
          .filter(
            (coin) =>
              coin.ath_change_percentage && coin.ath_change_percentage < 0
          )
          .sort((a, b) => a.ath_change_percentage - b.ath_change_percentage)
          .slice(0, 8);
        setPriceChangeATH(athDropCoins);

        // Get most voted coins (using market cap as proxy for popularity)
        const mostVotedCoins = topCoinsData
          .filter((coin) => coin.market_cap_rank && coin.market_cap_rank <= 20)
          .sort((a, b) => b.market_cap - a.market_cap)
          .slice(0, 8);
        setMostVoted(mostVotedCoins);

        // Set upcoming coins
        setUpcomingCoins(upcomingCoinsData);
        console.log("Upcoming Coins:", upcomingCoinsData);

        // Get most viewed coins (using market cap as proxy for popularity)
        const mostViewedCoins = topCoinsData
          .filter((coin) => coin.market_cap_rank && coin.market_cap_rank <= 30)
          .sort((a, b) => b.total_volume - a.total_volume)
          .slice(0, 8);
        setMostViewed(mostViewedCoins);

        setTokenUnlocks([]);
      } catch (error) {
        console.error("Error fetching highlights data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCard = (
    title,
    icon,
    children,
    showHeaders = true,
    moreLink = null
  ) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>
        {moreLink ? (
          <Link
            to={moreLink}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors dark:text-gray-400 dark:hover:text-gray-200"
          >
            more &gt;
          </Link>
        ) : (
          <span className="text-sm text-gray-400">more &gt;</span>
        )}
      </div>

      {showHeaders && (
        <div className="grid grid-cols-3 gap-4 mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide dark:text-gray-400">
          <div>Coin</div>
          <div className="text-right">Price</div>
          <div className="text-right">24h</div>
        </div>
      )}

      <div className="space-y-3">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-12xl mx-auto p-4">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            {currentCard || "Top Trending Cryptocurrencies Today"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the top trending cryptocurrencies on CoinGecko. This list
            is sorted by coins that are most searched for in the last 3 hours.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-300 rounded dark:bg-gray-600"></div>
                    <div className="h-6 bg-gray-300 rounded w-24 dark:bg-gray-600"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-12 dark:bg-gray-600"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600"></div>
                        <div className="h-4 bg-gray-300 rounded w-16 dark:bg-gray-600"></div>
                      </div>
                      <div className="h-4 bg-gray-300 rounded w-12 dark:bg-gray-600"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render detailed view for specific cards
  if (currentCard === "Top Gainers") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Top Gainers Today
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the cryptocurrencies with the highest 24-hour price gains.
            These coins have shown the most positive price movement in the last
            24 hours.
          </p>
        </div>

        {/* Top Gainers Detailed Table */}
        <div
          className="rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--bg-primary)",
          }}
        >
          <div
            className="px-6 py-4 border-b border-gray-200"
            style={{
              borderColor: "var(--bg-primary)",
            }}
          >
            <h3
              className="text-lg font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Top Gainers - 24h
            </h3>
          </div>
          <table className="w-full">
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
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Coin
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Price
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  24h Change
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  24h Volume
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Market Cap
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Sparkline
                </th>
              </tr>
            </thead>
            <tbody
              style={{
                backgroundColor: "var(--bg-card)",
              }}
            >
              {topGainers.slice(0, 10).map((coin, index) => (
                <tr
                  key={coin.id}
                  className="transition-colors"
                  style={{
                    borderBottomColor: "var(--bg-primary)",
                  }}
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {/* {coin.symbol?.charAt(0) || "?"} */}
                      </div>
                      <div className="ml-4">
                        <div
                          className="text-sm font-medium"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          {/* {coin.name?.split(" ").slice(0, 2).join(" ")} */}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {/* {coin.symbol?.toUpperCase()} */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    <span>
                      <span className="text-base">
                        {Number(coin.current_price).toFixed(2)}
                      </span>
                      <span className="text-xs ml-1 align-top">AED</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex flex-col items-center px-2 py-1 rounded-full text-xs ${
                        coin.price_change_percentage_24h > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      <span className="font-medium">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                      </span>
                      <span className="text-xs">
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </span>
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {formatVolume(coin.total_volume)}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {formatMarketCap(coin.market_cap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Sparkline data={coin.sparkline_in_7d} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render detailed view for Top Losers
  if (currentCard === "Top Losers") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Top Losers Today
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the cryptocurrencies with the highest 24-hour price losses.
            These coins have shown the most negative price movement in the last
            24 hours.
          </p>
        </div>

        {/* Top Losers Detailed Table */}
        <div
          className="rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--bg-primary)",
          }}
        >
          <div
            className="px-6 py-4 border-b border-gray-200"
            style={{
              borderColor: "var(--bg-primary)",
            }}
          >
            <h3
              className="text-lg font-semibold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Top Losers - 24h
            </h3>
          </div>
          <table className="w-full">
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
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Coin
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Price
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  24h Change
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  24h Volume
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Market Cap
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Sparkline
                </th>
              </tr>
            </thead>
            <tbody
              style={{
                backgroundColor: "var(--bg-card)",
              }}
            >
              {topLosers.slice(0, 10).map((coin, index) => (
                <tr
                  key={coin.id}
                  className="transition-colors"
                  style={{
                    borderBottomColor: "var(--bg-primary)",
                  }}
                >
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {coin.symbol?.charAt(0) || "?"}
                      </div>
                      <div className="ml-4">
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
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    <span>
                      <span className="text-base">
                        {Number(coin.current_price).toFixed(2)}
                      </span>
                      <span className="text-xs ml-1 align-top">AED</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex flex-col items-center px-2 py-1 rounded-full text-xs ${
                        coin.price_change_percentage_24h > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      <span className="font-medium">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                      </span>
                      <span className="text-xs">
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </span>
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {formatVolume(coin.total_volume)}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {formatMarketCap(coin.market_cap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Sparkline data={coin.sparkline_in_7d} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render detailed view for New Coins
  if (currentCard === "New Coins") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            New Cryptocurrencies
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the latest cryptocurrencies that have been recently added
            to CoinGecko. These are new projects that have just entered the
            market.
          </p>
        </div>

        {/* New Coins Detailed Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              New Coins
            </h2>
          </div>
          <div
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48 dark:text-gray-300">
                    Coin
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-20 dark:text-gray-300">
                    State
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-24 dark:text-gray-300">
                    Price
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-16 dark:text-gray-300">
                    1h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    7d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    30d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h Volume
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Market Cap
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {newCoins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{index + 1}</span>
                        {isFavorite(coin.id) ? (
                          <FaStar
                            className="w-4 h-4 cursor-pointer text-yellow-500"
                            onClick={() => toggleFavorite(coin)}
                          />
                        ) : (
                          <FiStar
                            className="w-4 h-4 cursor-pointer text-gray-300"
                            onClick={() => toggleFavorite(coin)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold dark:bg-gray-700">
                            {coin.image ? (
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-6 h-6 rounded-full"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : null}
                            <span
                              className="text-gray-600"
                              style={{
                                display: coin.image ? "none" : "flex",
                              }}
                            >
                              {coin.symbol?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-11 dark:text-gray-500">
                          Rank: {coin.market_cap_rank || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600">
                        Buy
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <span>
                        <span className="text-base">
                          {Number(coin.current_price).toFixed(2)}
                        </span>
                        <span className="text-xs ml-1 align-top">AED</span>
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_1h_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_7d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_7d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_30d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_30d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_30d_in_currency
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
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
        </div>
      </div>
    );
  }

  // Render detailed view for Most Viewed
  if (currentCard === "Most Viewed") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Most Viewed Cryptocurrencies
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the cryptocurrencies that are getting the most attention
            and views on CoinGecko. These coins are trending in popularity.
          </p>
        </div>

        {/* Most Viewed Detailed Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Most Viewed Coins
            </h2>
          </div>
          <div
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48 dark:text-gray-300">
                    Coin
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-20 dark:text-gray-300">
                    State
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-24 dark:text-gray-300">
                    Price
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-16 dark:text-gray-300">
                    1h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    7d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    30d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h Volume
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Market Cap
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {mostViewed.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{index + 1}</span>
                        {isFavorite(coin.id) ? (
                          <FaStar
                            className="w-4 h-4 cursor-pointer text-yellow-500"
                            onClick={() => toggleFavorite(coin)}
                          />
                        ) : (
                          <FiStar
                            className="w-4 h-4 cursor-pointer text-gray-300"
                            onClick={() => toggleFavorite(coin)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold dark:bg-gray-700">
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
                            ) : null}
                            <span
                              className="text-gray-600"
                              style={{
                                display: coin.image ? "none" : "flex",
                              }}
                            >
                              {coin.symbol?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-11 dark:text-gray-500">
                          Rank: {coin.market_cap_rank || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600">
                        Buy
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <span>
                        <span className="text-base">
                          {Number(coin.current_price).toFixed(2)}
                        </span>
                        <span className="text-xs ml-1 align-top">AED</span>
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_1h_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_7d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_7d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_30d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_30d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_30d_in_currency
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
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
        </div>
      </div>
    );
  }

  // Render detailed view for Highest Volume
  if (currentCard === "Highest Volume") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Highest Trading Volume (24h)
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the cryptocurrencies with the highest 24-hour trading
            volume. These coins have the largest trading activity over the past
            day.
          </p>
        </div>

        {/* Highest Volume Detailed Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Highest Volume (24h)
            </h2>
          </div>
          <div
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48 dark:text-gray-300">
                    Coin
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-20 dark:text-gray-300">
                    State
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-24 dark:text-gray-300">
                    Price
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-16 dark:text-gray-300">
                    1h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    7d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    30d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h Volume
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Market Cap
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {highestVolume.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{index + 1}</span>
                        {isFavorite(coin.id) ? (
                          <FaStar
                            className="w-4 h-4 cursor-pointer text-yellow-500"
                            onClick={() => toggleFavorite(coin)}
                          />
                        ) : (
                          <FiStar
                            className="w-4 h-4 cursor-pointer text-gray-300"
                            onClick={() => toggleFavorite(coin)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold dark:bg-gray-700">
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
                            ) : null}
                            <span
                              className="text-gray-600"
                              style={{ display: coin.image ? "none" : "flex" }}
                            >
                              {coin.symbol?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-11 dark:text-gray-500">
                          Rank: {coin.market_cap_rank || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600">
                        Buy
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <span>
                        <span className="text-base">
                          {Number(coin.current_price).toFixed(2)}
                        </span>
                        <span className="text-xs ml-1 align-top">AED</span>
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_1h_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_7d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_7d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_30d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_30d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_30d_in_currency
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
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
        </div>
      </div>
    );
  }

  // Render detailed view for Price Change since ATH (%)
  if (currentCard === "Price Change since ATH (%)") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Price Change since ATH
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Coins ranked by how far they are from their all-time highs. Negative
            values indicate they are below ATH.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ATH Change
            </h2>
          </div>
          <div
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48 dark:text-gray-300">
                    Coin
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-20 dark:text-gray-300">
                    State
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-24 dark:text-gray-300">
                    Price
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-16 dark:text-gray-300">
                    1h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    7d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    30d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h Volume
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Market Cap
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {priceChangeATH.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{index + 1}</span>
                        {isFavorite(coin.id) ? (
                          <FaStar
                            className="w-4 h-4 cursor-pointer text-yellow-500"
                            onClick={() => toggleFavorite(coin)}
                          />
                        ) : (
                          <FiStar
                            className="w-4 h-4 cursor-pointer text-gray-300"
                            onClick={() => toggleFavorite(coin)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold dark:bg-gray-700">
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
                            ) : null}
                            <span
                              className="text-gray-600"
                              style={{ display: coin.image ? "none" : "flex" }}
                            >
                              {coin.symbol?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-11 dark:text-gray-500">
                          Rank: {coin.market_cap_rank || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600">
                        Buy
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <span>
                        <span className="text-base">
                          {Number(coin.current_price).toFixed(2)}
                        </span>
                        <span className="text-xs ml-1 align-top">AED</span>
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_1h_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_7d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_7d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_30d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_30d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_30d_in_currency
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
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
        </div>
      </div>
    );
  }

  // Render detailed view for Most Voted Coins
  if (currentCard === "Most Voted Coins") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Most Voted Coins
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Popular coins by market cap and user interest.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Most Voted Coins
            </h2>
          </div>
          <div
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48 dark:text-gray-300">
                    Coin
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-20 dark:text-gray-300">
                    State
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-24 dark:text-gray-300">
                    Price
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-16 dark:text-gray-300">
                    1h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    7d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    30d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h Volume
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Market Cap
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {mostVoted.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{index + 1}</span>
                        {isFavorite(coin.id) ? (
                          <FaStar
                            className="w-4 h-4 cursor-pointer text-yellow-500"
                            onClick={() => toggleFavorite(coin)}
                          />
                        ) : (
                          <FiStar
                            className="w-4 h-4 cursor-pointer text-gray-300"
                            onClick={() => toggleFavorite(coin)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold dark:bg-gray-700">
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
                            ) : null}
                            <span
                              className="text-gray-600"
                              style={{ display: coin.image ? "none" : "flex" }}
                            >
                              {coin.symbol?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-11 dark:text-gray-500">
                          Rank: {coin.market_cap_rank || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600">
                        Buy
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <span>
                        <span className="text-base">
                          {Number(coin.current_price).toFixed(2)}
                        </span>
                        <span className="text-xs ml-1 align-top">AED</span>
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_1h_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_7d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_7d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_30d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_30d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_30d_in_currency
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
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
        </div>
      </div>
    );
  }

  // Render detailed view for Upcoming Coins
  if (currentCard === "Upcoming Coins") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Upcoming Coins
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Coins with market cap rank greater than 50, likely emerging
            projects.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Upcoming Coins
            </h2>
          </div>
          <div
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-48 dark:text-gray-300">
                    Coin
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-20 dark:text-gray-300">
                    State
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-24 dark:text-gray-300">
                    Price
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider w-16 dark:text-gray-300">
                    1h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    7d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    30d
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    24h Volume
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Market Cap
                  </th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {upcomingCoins.map((coin, index) => (
                  <tr
                    key={coin.id}
                    className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                  >
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{index + 1}</span>
                        {isFavorite(coin.id) ? (
                          <FaStar
                            className="w-4 h-4 cursor-pointer text-yellow-500"
                            onClick={() => toggleFavorite(coin)}
                          />
                        ) : (
                          <FiStar
                            className="w-4 h-4 cursor-pointer text-gray-300"
                            onClick={() => toggleFavorite(coin)}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold dark:bg-gray-700">
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
                            ) : null}
                            <span
                              className="text-gray-600"
                              style={{ display: coin.image ? "none" : "flex" }}
                            >
                              {coin.symbol?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {coin.name?.split(" ").slice(0, 2).join(" ")}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coin.symbol?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-11 dark:text-gray-500">
                          Rank: {coin.market_cap_rank || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600">
                        Buy
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                      <span>
                        <span className="text-base">
                          {Number(coin.current_price).toFixed(2)}
                        </span>
                        <span className="text-xs ml-1 align-top">AED</span>
                      </span>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_1h_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_24h?.toFixed(1)}%
                        {getPercentageIcon(coin.price_change_percentage_24h)}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_7d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_7d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                        coin.price_change_percentage_30d_in_currency
                      )}`}
                    >
                      <div className="flex items-center justify-center">
                        {coin.price_change_percentage_30d_in_currency?.toFixed(
                          1
                        )}
                        %
                        {getPercentageIcon(
                          coin.price_change_percentage_30d_in_currency
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
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
        </div>
      </div>
    );
  }

  // Render detailed view for Trending Coins
  if (currentCard === "Trending Coins") {
    return (
      <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
        <Breadcrumb
          currentCard={currentCard}
          onBackToHighlights={handleBackToHighlights}
        />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 dark:text-gray-100">
            Trending Coins Today
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover the most trending cryptocurrencies on CoinGecko. This list
            is sorted by coins that are most searched for in the last 3 hours.
          </p>
        </div>

        {/* Trending Coins Detailed Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Trending Coins
            </h2>
          </div>
          <div
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "60px" }}
                  >
                    #
                  </th>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "120px" }}
                  >
                    Coin
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "60px" }}
                  >
                    State
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "100px" }}
                  >
                    Price
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "80px" }}
                  >
                    1h
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "80px" }}
                  >
                    24h
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "80px" }}
                  >
                    7d
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "80px" }}
                  >
                    30d
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "120px" }}
                  >
                    24h Volume
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "120px" }}
                  >
                    Market Cap
                  </th>
                  <th
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ minWidth: "150px" }}
                  >
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {trendingCoins && trendingCoins.length > 0 ? (
                  trendingCoins.map((coin, index) => (
                    <tr
                      key={coin.id}
                      className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-700"
                    >
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{index + 1}</span>
                          {isFavorite(coin.id) ? (
                            <FaStar
                              className="w-4 h-4 cursor-pointer text-yellow-500"
                              onClick={() => toggleFavorite(coin)}
                            />
                          ) : (
                            <FiStar
                              className="w-4 h-4 cursor-pointer text-gray-300"
                              onClick={() => toggleFavorite(coin)}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold dark:bg-gray-700">
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
                              ) : null}
                              <span
                                className="text-gray-600"
                                style={{
                                  display: coin.image ? "none" : "flex",
                                }}
                              >
                                {coin.symbol?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {coin.name?.split(" ").slice(0, 2).join(" ")}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {coin.symbol?.toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 ml-11 dark:text-gray-500">
                            Rank: {coin.market_cap_rank || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                        <button className="bg-transparent border border-green-500 text-green-500 text-sm px-2 py-1 rounded hover:bg-green-500 hover:text-white active:bg-green-600 active:border-green-600 transition-all duration-200">
                          Buy
                        </button>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center font-medium dark:text-gray-100">
                        <span>
                          <span className="text-base">
                            {Number(coin.current_price).toFixed(2)}
                          </span>
                          <span className="text-xs ml-1 align-top">AED</span>
                        </span>
                      </td>
                      <td
                        className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                          coin.price_change_percentage_1h_in_currency
                        )}`}
                      >
                        <div className="flex items-center justify-end">
                          {coin.price_change_percentage_1h_in_currency?.toFixed(
                            1
                          )}
                          %
                          {getPercentageIcon(
                            coin.price_change_percentage_1h_in_currency
                          )}
                        </div>
                      </td>
                      <td
                        className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                          coin.price_change_percentage_24h
                        )}`}
                      >
                        <div className="flex items-center justify-end">
                          {coin.price_change_percentage_24h?.toFixed(1)}%
                          {getPercentageIcon(coin.price_change_percentage_24h)}
                        </div>
                      </td>
                      <td
                        className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                          coin.price_change_percentage_7d_in_currency
                        )}`}
                      >
                        <div className="flex items-center justify-end">
                          {coin.price_change_percentage_7d_in_currency?.toFixed(
                            1
                          )}
                          %
                          {getPercentageIcon(
                            coin.price_change_percentage_7d_in_currency
                          )}
                        </div>
                      </td>
                      <td
                        className={`px-3 py-3 whitespace-nowrap text-sm text-center font-medium flex items-center justify-end  ${getPercentageColor(
                          coin.price_change_percentage_30d_in_currency
                        )}`}
                      >
                        <div className="flex items-center justify-end">
                          {coin.price_change_percentage_30d_in_currency?.toFixed(
                            1
                          )}
                          %
                          {getPercentageIcon(
                            coin.price_change_percentage_30d_in_currency
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                        {formatVolume(coin.total_volume)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-center dark:text-gray-100">
                        {formatMarketCap(coin.market_cap)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center">
                        {/* {coin.sparkline} */}
                        {coin.sparkline ? (
                          <img
                            src={coin.sparkline}
                            alt={coin.name}
                            className="w-45 h-15 rounded-full"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : (
                          "load.."
                        )}
                        {/* {console.log("sparkline", coin.sparkline)} */}
                        {/* <div className="flex justify-center">
                          <Sparkline
                            data={coin.sparkline_in_7d?.price || []}
                            color={
                              coin.price_change_percentage_7d_in_currency >= 0
                                ? "#10B981"
                                : "#EF4444"
                            }
                            width={100}
                            height={30}
                          />
                          {console.log("sparkline",coin)}
                        </div> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No trending data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-12xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
      <Breadcrumb
        currentCard={currentCard}
        onBackToHighlights={handleBackToHighlights}
      />
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-800 mb-2 "
          style={{
            color: "var(--text-primary)",
          }}
        >
          {currentCard || "Top Trending Cryptocurrencies Today"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover the top trending cryptocurrencies on CoinGecko. This list is
          sorted by coins that are most searched for in the last 3 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {renderCard(
          "Trending Coins",
          <FaFire className="w-5 h-5 text-orange-500" />,
          trendingCoins.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right  text-xs">
                <span className=" font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex items-center justify-center ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "trending"
        )}

        {renderCard(
          "Top Gainers",
          <FiTrendingUp className="w-5 h-5 text-green-500" />,
          topGainers.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs ">
                <span className=" font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex  justify-center ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "top-gainers"
        )}

        {renderCard(
          "Top Losers",
          <FiTrendingDown className="w-5 h-5 text-red-500" />,
          topLosers.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className=" font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex items-center justify-end  ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "top-losers"
        )}

        {renderCard(
          "New Coins",
          <FaRocket className="w-5 h-5 text-blue-500" />,
          newCoins.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className=" font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex items-center justify-end  ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "new-coins"
        )}

        {renderCard(
          "Most Viewed",
          <FaEye className="w-5 h-5 text-purple-500" />,
          mostViewed.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className=" font-semibold text-gray-800 dark:text-gray-100 ">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex items-center justify-end  ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "most-viewed"
        )}

        {renderCard(
          "Highest Volume",
          <IoMdArrowDropup className="w-5 h-5 text-indigo-500" />,
          highestVolume.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex items-center justify-end  ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "highest-volume"
        )}

        {renderCard(
          "Price Change since ATH ",
          <FiTrendingDown className="w-5 h-5 text-red-600" />,
          priceChangeATH.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className=" font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex items-center justify-end  ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "ath-change"
        )}

        {renderCard(
          "Most Voted Coins",
          <FaTrophy className="w-5 h-5 text-yellow-500" />,
          mostVoted.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-5 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className=" font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right ">
                <span
                  className={`text-xs flex items-center justify-end  ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "most-voted"
        )}

        {renderCard(
          "Upcoming Coins",
          <FaCalendar className="w-5 h-5 text-blue-600" />,
          upcomingCoins.slice(0, 5).map((coin, index) => (
            <div
              key={coin.id}
              className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-b-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {coin.name?.split(" ").slice(0, 1).join(" ")}
                </span>
                <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                  {/* {coin.symbol} */}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className=" font-semibold text-gray-800 dark:text-gray-100">
                  {formatPrice(coin.current_price)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs flex items-center justify-end  ${getPercentageColor(
                    coin.price_change_percentage_24h
                  )}`}
                >
                  {getPercentageIcon(coin.price_change_percentage_24h)}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          )),
          true,
          "upcoming"
        )}
      </div>
    </div>
  );
};

export default Highlights;
