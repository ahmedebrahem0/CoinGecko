import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const PriceChart = ({
  data = [],
  timeframe = "7",
  onChangeTimeframe,
  currency = "usd",
  onChangeCurrency,
  isFetching = false,
  activeSeries: controlledSeries,
  onChangeSeries,
}) => {
  // Keep previous data to avoid full disappearance when switching
  const prevDataRef = useRef([]);
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      prevDataRef.current = data;
    }
  }, [data]);
  const plotted = useMemo(() => (data && data.length ? data : prevDataRef.current), [data]);

  // UI state
  const [internalSeries, setInternalSeries] = useState("price"); // 'price' | 'marketCap'
  const activeSeries = controlledSeries ?? internalSeries;
  const setActiveSeries = onChangeSeries ?? setInternalSeries;
  const [logScale, setLogScale] = useState(false);

  const formatPrice = (p) => {
    if (p >= 1) return `$${p.toFixed(2)}`;
    if (p >= 0.01) return `$${p.toFixed(4)}`;
    return `$${p.toFixed(6)}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const mainPoint = payload.find((p) => p.dataKey === activeSeries);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 mb-1">{label}</div>
          <div className="text-sm font-semibold">
            {activeSeries === "price" ? formatPrice(mainPoint?.value || 0) : `$${(mainPoint?.value || 0).toLocaleString()}`}
          </div>
        </div>
      );
    }
    return null;
  };

  const ranges = [
    { value: "1", label: "24H" },
    { value: "7", label: "7D" },
    { value: "14", label: "14D" },
    { value: "30", label: "1M" },
    { value: "90", label: "3M" },
    { value: "365", label: "1Y" },
    { value: "max", label: "Max" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            {[
              { key: "price", label: "Price" },
              { key: "marketCap", label: "Market Cap" },
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => setActiveSeries(b.key)}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  activeSeries === b.key ? "bg-white dark:bg-gray-700 text-green-700 border border-green-600" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setLogScale((v) => !v)}
            className={`px-2 py-1 text-xs rounded border ${logScale ? "bg-gray-200 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}
            title="Toggle Linear/Log"
          >
            {logScale ? "LOG" : "LIN"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => onChangeCurrency && onChangeCurrency(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="btc">BTC</option>
            <option value="eth">ETH</option>
          </select>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => onChangeTimeframe && onChangeTimeframe(r.value)}
                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded ${
                  timeframe === r.value ? "bg-white dark:bg-gray-700 text-green-700 border border-green-600" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={plotted} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="areaFillGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.06} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e5e7eb" opacity={0.3} vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis
              yAxisId="left"
              scale={logScale ? "log" : "auto"}
              domain={["auto", "auto"]}
              tickFormatter={(v) => {
                if (!isFinite(v)) return "";
                if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
                if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
                return `$${v}`;
              }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey={activeSeries}
              stroke="#16a34a"
              fill="url(#areaFillGreen)"
              strokeWidth={2.5}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Subtle updating status without removing the chart */}
      {isFetching && (
        <div className="text-center text-xs text-gray-500 mt-2">Updating…</div>
      )}
    </div>
  );
};

export default PriceChart;
