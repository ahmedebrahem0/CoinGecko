import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

const Sparkline = ({
  data,
  color,
  width = 130,
  height = 32,
  showGrid = false,
  showTooltip = false,
}) => {
  const defaultColor = "#4299e1"; // Default blue color

  const formatData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return null;

    // If data is already an array of numbers, convert to objects
    if (typeof apiData[0] === "number") {
      return apiData.map((price, index) => ({
        index,
        value: price,
        formattedValue: formatPrice(price),
      }));
    }

    // If data is array of [timestamp, price] pairs
    if (Array.isArray(apiData[0]) && apiData[0].length === 2) {
      return apiData.map(([timestamp, price], index) => ({
        index,
        value: price,
        formattedValue: formatPrice(price),
        timestamp: new Date(timestamp).toLocaleDateString(),
      }));
    }

    return null;
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  // إنشاء بيانات عشوائية للرسم البياني مع تقلبات طبيعية
  const generateRandomData = () => {
    const basePrice = Math.random() * 100 + 50;
    const volatility = 0.15; // 15% تقلب
    const trend = Math.random() > 0.5 ? 1 : -1; // اتجاه عشوائي
    
    return Array.from({ length: 20 }, (_, i) => {
      // إضافة تقلبات طبيعية مع اتجاه عام
      const randomFactor = (Math.random() - 0.5) * 2 * volatility;
      const trendFactor = (i / 19) * volatility * trend * 0.5;
      const newPrice = basePrice * (1 + randomFactor + trendFactor);
      
      return {
        index: i,
        value: Math.max(newPrice, 1), // تجنب الأسعار السالبة
        formattedValue: formatPrice(Math.max(newPrice, 1)),
      };
    });
  };

  const chartData = formatData(data) || generateRandomData();

  // تحديد اللون بناءً على اتجاه السعر
  const getChartColor = () => {
    if (chartData.length < 2) return color || defaultColor;
    
    const firstPrice = chartData[0]?.value || 0;
    const lastPrice = chartData[chartData.length - 1]?.value || 0;
    
    if (lastPrice > firstPrice) {
      return "#10B981"; // Green for positive
    } else if (lastPrice < firstPrice) {
      return "#EF4444"; // Red for negative
    } else {
      return color || defaultColor; // Default color for neutral
    }
  };

  const chartColor = getChartColor();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {payload[0]?.payload?.timestamp || `Point ${label}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Price: {payload[0]?.payload?.formattedValue || payload[0]?.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative group">
      {/* Chart Container */}
      <div
        className="relative overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
        style={{
          width: width,
          height: height,
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Responsive Chart */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
          >
            {/* Grid Lines */}
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                opacity={0.3}
                vertical={false}
              />
            )}

            {/* X Axis */}
            {showGrid && (
              <XAxis
                dataKey="index"
                hide={true}
                axisLine={false}
                tickLine={false}
              />
            )}

            {/* Y Axis */}
            {showGrid && (
              <YAxis
                hide={true}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 1", "dataMax + 1"]}
              />
            )}

            {/* Area Chart with Gradient */}
            <defs>
              <linearGradient
                id={`gradient-${chartColor.replace("#", "")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="50%" stopColor={chartColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient
                id={`line-gradient-${chartColor.replace("#", "")}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={1} />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={`url(#gradient-${chartColor.replace("#", "")})`}
              fillOpacity={0.8}
            />

            {/* Line Chart */}
            <Line
              type="monotone"
              dataKey="value"
              stroke={`url(#line-gradient-${chartColor.replace("#", "")})`}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                stroke: chartColor,
                strokeWidth: 2,
                fill: "white",
                strokeDasharray: "3 3",
              }}
              connectNulls={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />

            {/* Tooltip */}
            {showTooltip && (
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: chartColor,
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Performance Indicator */}
      {data && data.length > 1 && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
          style={{
            backgroundColor: chartColor,
          }}
        />
      )}

      {/* Loading State */}
      {/* {!data && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-lg">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )} */}
    </div>
  );
};

export default Sparkline;
