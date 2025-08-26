import React, { useState } from "react";
import { usePoolsData } from "../hooks/usePoolsData";
import PoolsCard from "../components/PoolsCard";
import PageHeader from "../components/PageHeader";
import Breadcrumb from "../components/Breadcrumb";

const Pools = () => {
  const { networks, trendingPools, loading, error, fetchTopPoolsByToken } =
    usePoolsData();

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenPools, setTokenPools] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // أمثلة على عناوين العملات للاختبار
  const tokenExamples = {
    ethereum: "0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C8", // USDC
    polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
    bsc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC on BSC
  };

  const handleSearchPools = async () => {
    if (!selectedNetwork || !tokenAddress) {
      alert("Please select a network and enter token address");
      return;
    }

    setSearchLoading(true);
    try {
      console.log(
        `Searching pools for network: ${selectedNetwork}, token: ${tokenAddress}`
      );
      const pools = await fetchTopPoolsByToken(
        selectedNetwork,
        tokenAddress,
        10
      );
      console.log("Search results:", pools);
      setTokenPools(pools);
    } catch (err) {
      console.error("Failed to fetch pools:", err);
      // لا نعرض alert هنا لأن البيانات الافتراضية ستظهر
      console.log("Using fallback data due to API error");
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePoolClick = (pool) => {
    console.log("Selected pool:", pool);
    // يمكن إضافة المزيد من التفاصيل هنا
  };

  const handleNetworkChange = (networkId) => {
    setSelectedNetwork(networkId);
    // تعيين عنوان العملة الافتراضي عند تغيير الشبكة
    if (tokenExamples[networkId]) {
      setTokenAddress(tokenExamples[networkId]);
    }
  };

  // تأكد من أن networks array
  const networksList = Array.isArray(networks) ? networks : [];

  // دالة للحصول على اسم الشبكة
  const getNetworkName = (network) => {
    // للبيانات الافتراضية
    if (network.name) {
      return network.name;
    }
    // للبيانات من API
    if (network.attributes && network.attributes.name) {
      return network.attributes.name;
    }
    // fallback
    return network.id || "Unknown Network";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb />

        <PageHeader
          title="DeFi Pools"
          subtitle="Discover trending pools and search for specific token pools across different networks"
        />

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Search Token Pools</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network
              </label>
              <select
                value={selectedNetwork}
                onChange={(e) => handleNetworkChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Network</option>
                {networksList.map((network) => (
                  <option key={network.id} value={network.id}>
                    {getNetworkName(network)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Address
              </label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter token contract address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedNetwork && tokenExamples[selectedNetwork] && (
                <p className="text-xs text-gray-500 mt-1">
                  Example: {tokenExamples[selectedNetwork]}
                </p>
              )}
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearchPools}
                disabled={searchLoading || !selectedNetwork || !tokenAddress}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchLoading ? "Searching..." : "Search Pools"}
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Quick Examples:
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(tokenExamples).map(([network, address]) => (
                <button
                  key={network}
                  onClick={() => {
                    setSelectedNetwork(network);
                    setTokenAddress(address);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                >
                  {network.toUpperCase()} USDC
                </button>
              ))}
            </div>
          </div>

          {/* API Status */}
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ API Error: {error}. Using demo data for testing.
              </p>
            </div>
          )}
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Pools */}
          <PoolsCard
            title="Trending Pools"
            pools={trendingPools}
            loading={loading}
            error={error}
            onPoolClick={handlePoolClick}
          />

          {/* Token Pools */}
          <PoolsCard
            title="Token Pools"
            pools={tokenPools}
            loading={searchLoading}
            error={null}
            onPoolClick={handlePoolClick}
          />
        </div>

        {/* Network Information */}
        {networksList.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Supported Networks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {networksList.slice(0, 12).map((network) => (
                <div
                  key={network.id}
                  className="p-3 bg-gray-50 rounded-lg text-center"
                >
                  <div className="font-medium text-gray-800">
                    {getNetworkName(network)}
                  </div>
                  <div className="text-sm text-gray-500">{network.id}</div>
                </div>
              ))}
            </div>
            {networksList.length > 12 && (
              <div className="text-center mt-4">
                <p className="text-gray-500">
                  And {networksList.length - 12} more networks...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pools;
