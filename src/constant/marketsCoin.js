import React from "react";

import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export const formatVolume = (volume) => {
  if (volume >= 1e12) {
    return `$ ${(volume / 1e12).toFixed(2)}T`;
  } else if (volume >= 1e9) {
    return `$ ${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `$ ${(volume / 1e6).toFixed(2)}M`;
  } else {
    return formatPrice(volume);
  }
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatMarketCap = (marketCap) => {
  if (marketCap >= 1e12) {
    return `$ ${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$ ${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$ ${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return formatPrice(marketCap);
  }
};

export const getPercentageColor = (percentage) => {
  if (!percentage && percentage !== 0) return "text-gray-500";
  return percentage >= 0 ? "text-green-600" : "text-red-600";
};

export const getPercentageIcon = (percentage) => {
  if (!percentage && percentage !== 0) return null;
  const Icon = percentage >= 0 ? IoMdArrowDropup : IoMdArrowDropdown;
  return React.createElement(Icon);
};

// تحديث دالة filteredCoins لتستقبل 4 معاملات
export const filteredCoins = (coins, filters, searchTerm, sortConfig) => {
  if (!coins) return [];

  let filtered = [...coins];

  // تطبيق البحث
  if (searchTerm && searchTerm.trim()) {
    const normalizedSearch = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (coin) =>
        coin.name?.toLowerCase().includes(normalizedSearch) ||
        coin.symbol?.toLowerCase().includes(normalizedSearch)
    );
  }

  // تطبيق الفلاتر
  if (filters.category && filters.category !== "All") {
    filtered = filtered.filter((coin) =>
      coin.categories?.includes(filters.category)
    );
  }

  if (filters.priceRange) {
    filtered = filtered.filter(
      (coin) =>
        coin.current_price >= filters.priceRange.min &&
        coin.current_price <= filters.priceRange.max
    );
  }

  if (filters.marketCap) {
    filtered = filtered.filter(
      (coin) =>
        coin.market_cap >= filters.marketCap.min &&
        coin.market_cap <= filters.marketCap.max
    );
  }

  if (filters.volume) {
    filtered = filtered.filter(
      (coin) =>
        coin.total_volume >= filters.volume.min &&
        coin.total_volume <= filters.volume.max
    );
  }

  if (filters.performance && filters.performance !== "all") {
    switch (filters.performance) {
      case "gainers":
        filtered = filtered.filter(
          (coin) => coin.price_change_percentage_24h > 5
        );
        break;
      case "losers":
        filtered = filtered.filter(
          (coin) => coin.price_change_percentage_24h < -5
        );
        break;
      case "stable":
        filtered = filtered.filter(
          (coin) =>
            coin.price_change_percentage_24h >= -5 &&
            coin.price_change_percentage_24h <= 5
        );
        break;
    }
  }

  // تطبيق الترتيب
  if (sortConfig && sortConfig.field) {
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.field];
      let bVal = b[sortConfig.field];

      // معالجة القيم الفارغة
      if (aVal === null || aVal === undefined) aVal = 0;
      if (bVal === null || bVal === undefined) bVal = 0;

      if (sortConfig.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  return filtered;
};

export const getSearchSuggestions = (coins, searchTerm, maxResults = 8) => {
  if (!coins || !searchTerm || searchTerm.length < 1) return [];

  const normalizedSearch = searchTerm.toLowerCase();

  // نظام الأولويات للبحث
  const scoredCoins = coins.map((coin) => {
    let score = 0;
    const symbol = coin.symbol?.toLowerCase() || "";
    const name = coin.name?.toLowerCase() || "";

    // الأولوية 1: تطابق تام للرمز
    if (symbol === normalizedSearch) score += 1000;
    // الأولوية 2: الرمز يبدأ بالبحث
    else if (symbol.startsWith(normalizedSearch)) score += 500;
    // الأولوية 3: الاسم يبدأ بالبحث
    else if (name.startsWith(normalizedSearch)) score += 300;
    // الأولوية 4: موجود في الرمز
    else if (symbol.includes(normalizedSearch)) score += 200;
    // الأولوية 5: موجود في الاسم
    else if (name.includes(normalizedSearch)) score += 100;

    return { ...coin, score };
  });

  return scoredCoins
    .filter((coin) => coin.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};

// إضافة الدوال المفقودة
export const getPriceRanges = () => [
  { label: "Under $0.01", min: 0, max: 0.01 },
  { label: "$0.01 - $0.10", min: 0.01, max: 0.1 },
  { label: "$0.10 - $1.00", min: 0.1, max: 1.0 },
  { label: "$1.00 - $10.00", min: 1.0, max: 10.0 },
  { label: "$10.00 - $100.00", min: 10.0, max: 100.0 },
  { label: "$100.00+", min: 100.0, max: Infinity },
];

export const getMarketCapRanges = () => [
  { label: "$100M - $1B", min: 1e8, max: 1e9 }, // 100 مليون - 1 مليار
  { label: "$1B - $10B", min: 1e9, max: 1e10 }, // 1 - 10 مليار
  { label: "$10B - $50B", min: 1e10, max: 5e10 }, // 10 - 50 مليار
  { label: "$50B - $100B", min: 5e10, max: 1e11 }, // 50 - 100 مليار
  { label: "$100B - $1T", min: 1e11, max: 1e12 }, // 100 مليار - 1 تريليون
  { label: "$1T+", min: 1e12, max: Infinity }, // فوق التريليون
];




export const getVolumeRanges = () => [
  { label: "Under $100K", min: 0, max: 1e5 }, // أقل من 100 ألف
  { label: "$100K - $1M", min: 1e5, max: 1e6 }, // 100 ألف - 1 مليون
  { label: "$1M - $10M", min: 1e6, max: 1e7 }, // 1 - 10 مليون
  { label: "$10M - $100M", min: 1e7, max: 1e8 }, // 10 - 100 مليون
  { label: "$100M - $1B", min: 1e8, max: 1e9 }, // 100 مليون - 1 مليار
  { label: "$1B+", min: 1e9, max: Infinity }, // أكتر من مليار
];


export const getUniqueCategories = (coins) => {
  if (!coins) return [];

  const categories = new Set();
  coins.forEach((coin) => {
    if (coin.categories && Array.isArray(coin.categories)) {
      coin.categories.forEach((category) => {
        if (category && category.trim()) {
          categories.add(category.trim());
        }
      });
    }
  });

  return ["All", ...Array.from(categories).sort()];
};

export const getPerformanceOptions = () => [
  { value: "all", label: "All Coins" },
  { value: "gainers", label: "Top Gainers" },
  { value: "losers", label: "Top Losers" },
  { value: "stable", label: "Stable Coins" },
];

export const getSortingOptions = () => [
  { value: "market_cap", label: "Market Cap", icon: "💰" },
  { value: "current_price", label: "Price", icon: "💵" },
  { value: "price_change_percentage_24h", label: "24h Change", icon: "📈" },
  { value: "total_volume", label: "Volume", icon: "📊" },
  { value: "market_cap_rank", label: "Rank", icon: "🏆" },
];
