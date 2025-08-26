import React from "react";
import { Link } from "react-router-dom";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { FaFire, FaRocket } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Sparkline from "../components/Sparkline";
import PageHeader from "../components/PageHeader";
import HomeSkeleton from "../components/HomeSkeleton";
import DebugPanel from "../components/DebugPanel";
import { useGlobalStats } from "../hooks/useGlobalStats";
import { useCoinsData } from "../hooks/useCoinsData";
import Markets from "./Markets";

const Home = () => {
  const { globalStats, loading: globalLoading } = useGlobalStats();
  const {
    topCoins,
    trendingCoins,
    topGainers,
    loading: coinsLoading,
    error,
  } = useCoinsData();
  const loading = globalLoading || coinsLoading;

  if (loading) return <HomeSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 "
      style={{
        backgroundColor: "var(--bg-primary)",
        // borderColor: "var(--bg-primary)",
      }}
    >
      {/* Debug Panel - Temporary */}
      {/* <div className="max-w-7xl mx-auto px-4 pt-4">
        <DebugPanel />
      </div> */}

      <PageHeader
        title="Cryptocurrency Prices by Market Cap"
        subtitle={
          <span className="flex flex-wrap items-center">
            The global cryptocurrency market cap today is $
            {loading
              ? "..."
              : (globalStats?.data?.total_market_cap?.usd / 1e12).toFixed(
                  2
                )}{" "}
            Trillion, a{" "}
            <span className="text-red-500 flex items-center mx-1">
              <IoMdArrowDropdown />
              {loading
                ? "..."
                : (
                    globalStats?.data?.market_cap_change_percentage_24h_usd || 0
                  ).toFixed(2) + "%"}
            </span>
            change in the last 24 hours.
          </span>
        }
      />

      {/* Three Cards Section */}
      <div className="w-full mx-auto px-4 mb-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-3 ">
          {/* Left Card - Market Cap & Trading Volume */}
          <div className="space-y-6 ">
            {/* Market Cap Section */}
            <div
              className="border border-gray-200 p-6 rounded-lg shadow-sm bg-gray-50"
              style={{
                backgroundColor: "var(--bg-card)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-2xl font-bold text-gray-800"
                    style={{ color: "var(--text-primary)" }}
                  >
                    AED
                    {loading
                      ? "..."
                      : Math.floor(
                          globalStats?.data?.total_market_cap?.usd / 1e4
                        ).toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-600 mr-2">Market Cap</div>
                    <div className="text-sm text-red-500 flex items-center">
                      <FiTrendingDown />
                      {loading
                        ? "..."
                        : (
                            globalStats?.data
                              ?.market_cap_change_percentage_24h_usd || 0
                          ).toFixed(2)}
                      %
                    </div>
                  </div>
                </div>
                <div className="w-35 h-8 bg-gray-50 rounded flex items-center justify-center">
                  <Sparkline color="#EF4444" />
                </div>
              </div>
            </div>

            {/* 24h Trading Volume Section */}
            <div
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm"
              style={{
                backgroundColor: "var(--bg-card)",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div
                    className="text-2xl font-bold text-gray-800"
                    style={{ color: "var(--text-primary)" }}
                  >
                    AED
                    {loading
                      ? "..."
                      : Math.floor(
                          globalStats?.data?.total_volume?.usd / 1e4
                        ).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    24h Trading Volume
                  </div>
                </div>
                <div className="w-35 h-8 bg-gray-50 rounded flex items-center justify-center">
                  <Sparkline color="#10B981" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Card - Trending */}
          <div
            className="bg-white rounded-lg shadow-md p-3 "
            style={{
              backgroundColor: "var(--bg-card)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FaFire className="text-orange-500 w-4 h-4 mr-2" />
                <h3
                  className="font-semibold text-gray-800"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Trending
                </h3>
              </div>
              <a href="#" className="text-blue-600 text-sm hover:text-blue-800">
                View more &gt;
              </a>
            </div>

            <div className="space-y-3">
              {loading
                ? // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between animate-pulse"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="text-right">
                        <div className="w-20 h-4 bg-gray-300 rounded mb-1"></div>
                        <div className="w-12 h-3 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))
                : // Real data - first 3 trending coins
                  trendingCoins?.coins?.slice(0, 3).map((coin, index) => {
                    const item = coin.item;
                    const priceChange =
                      item.data?.price_change_percentage_24h?.usd || 0;
                    const isPositive = priceChange >= 0;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-400 rounded"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                            <img
                              src={item.thumb}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold"
                              style={{ display: "none" }}
                            >
                              {item.symbol?.toUpperCase().charAt(0)}
                            </div>
                          </div>
                          <span
                            className="text-gray-800 font-medium "
                            style={{
                              color: "var(--text-primary)",
                              // backgroundColor: "rgba(0,0,0,0.1)",
                            }}
                          >
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right flex items-center">
                          <div className="text-sm text-gray-800 mx-2">
                            ${" "}
                            {item.data?.price
                              ? item.data.price.toFixed(4)
                              : "N/A"}
                          </div>
                          <div
                            className={`text-xs flex items-center ${
                              isPositive ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {isPositive ? (
                              <IoMdArrowDropup className="w-4 h-4" />
                            ) : (
                              <IoMdArrowDropdown />
                            )}
                            {Math.abs(priceChange).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Right Card - Top Gainers */}
          <div
            className="bg-white rounded-lg shadow-md p-3"
            style={{
              backgroundColor: "var(--bg-card)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <FaRocket className="text-red-500 w-4 h-4 mr-2" />
                <h3
                  className="font-semibold text-gray-800"
                  style={{ color: "var(--text-primary)" }}
                >
                  Top Gainers
                </h3>
              </div>
              <a href="#" className="text-blue-600 text-sm hover:text-blue-800">
                View more &gt;
              </a>
            </div>

            <div className="space-y-3">
              {loading
                ? // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between animate-pulse"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div className="text-right">
                        <div className="w-20 h-4 bg-gray-300 rounded mb-1"></div>
                        <div className="w-12 h-3 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))
                : // Real data - first 3 top gainers
                  topGainers?.slice(0, 4).map((coin, index) => {
                    const priceChange = coin.price_change_percentage_24h || 0;
                    const isPositive = priceChange >= 0;

                    return (
                      <div
                        key={coin.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-400 rounded"
                      >
                        <Link
                          to={`/coin/${coin.id}`}
                          className="flex items-center hover:text-blue-600 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold"
                              style={{ display: "none" }}
                            >
                              {coin.symbol?.toUpperCase().charAt(0)}
                            </div>
                          </div>
                          <span
                            className="text-gray-800 font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {coin.name}
                          </span>
                        </Link>
                        <div className="text-right flex items-center">
                          <div className="text-sm text-gray-800 mx-2">
                            ${coin.current_price?.toFixed(2) || "N/A"}
                          </div>
                          <div
                            className={`text-xs flex items-center ${
                              isPositive ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {isPositive ? (
                              <IoMdArrowDropup className="w-4 h-4" />
                            ) : (
                              <IoMdArrowDropdown />
                            )}
                            {Math.abs(priceChange).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>

      {/* باقي الأقسام */}
      <div className="mx-auto px-4">
        {/* Top Coins preview removed to avoid duplicate fetching. Use Markets page. */}

        {/* روابط سريعة لباقي الصفحات */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Quick Links
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/markets"
              className="bg-purple-600 text-white px-6 py-2 rounded shadow hover:bg-purple-700 transition"
            >
              Markets
            </a>
            <a
              href="/categories"
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              Categories
            </a>
            <a
              href="/exchanges"
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Exchanges
            </a>
            <a
              href="/nfts"
              className="bg-pink-600 text-white px-6 py-2 rounded shadow hover:bg-pink-700 transition"
            >
              NFTs
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
