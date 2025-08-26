// Data Export Utilities
export const exportToCSV = (data, filename = "market-data.csv") => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Handle special characters and wrap in quotes if needed
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = "market-data.json") => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = async (data, filename = "market-data.xlsx") => {
  try {
    // Dynamic import of xlsx library
    const XLSX = await import("xlsx");

    if (!data || data.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const columnWidths = [];
    Object.keys(data[0]).forEach((key) => {
      const maxLength = Math.max(
        key.length,
        ...data.map((row) => String(row[key] || "").length)
      );
      columnWidths.push({ wch: Math.min(maxLength + 2, 50) });
    });
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Market Data");

    // Generate and download file
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    // Fallback to CSV if Excel export fails
    exportToCSV(data, filename.replace(".xlsx", ".csv"));
  }
};

export const shareData = async (data, format = "json") => {
  if (!navigator.share) {
    console.warn("Web Share API not supported");
    return false;
  }

  try {
    let content = "";
    let filename = "";

    switch (format) {
      case "csv":
        const headers = Object.keys(data[0]);
        content = [
          headers.join(","),
          ...data.map((row) =>
            headers
              .map((header) => {
                const value = row[header];
                if (
                  typeof value === "string" &&
                  (value.includes(",") ||
                    value.includes('"') ||
                    value.includes("\n"))
                ) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
              })
              .join(",")
          ),
        ].join("\n");
        filename = "market-data.csv";
        break;
      case "json":
        content = JSON.stringify(data, null, 2);
        filename = "market-data.json";
        break;
      default:
        content = JSON.stringify(data, null, 2);
        filename = "market-data.json";
    }

    const blob = new Blob([content], {
      type: format === "csv" ? "text/csv" : "application/json",
    });
    const file = new File([blob], filename, {
      type: format === "csv" ? "text/csv" : "application/json",
    });

    await navigator.share({
      title: "Market Data Export",
      text: `Exported ${data.length} coins from the market`,
      files: [file],
    });

    return true;
  } catch (error) {
    console.error("Error sharing data:", error);
    return false;
  }
};

export const generateReport = (data, filters = {}) => {
  if (!data || data.length === 0) {
    return {
      summary: "No data available",
      statistics: {},
      topPerformers: [],
      topLosers: [],
    };
  }

  const report = {
    summary: `Market analysis for ${data.length} coins`,
    statistics: {
      totalCoins: data.length,
      totalMarketCap: data.reduce(
        (sum, coin) => sum + (coin.market_cap || 0),
        0
      ),
      totalVolume: data.reduce(
        (sum, coin) => sum + (coin.total_volume || 0),
        0
      ),
      averagePrice:
        data.reduce((sum, coin) => sum + (coin.current_price || 0), 0) /
        data.length,
      gainers: data.filter(
        (coin) => (coin.price_change_percentage_24h || 0) > 0
      ).length,
      losers: data.filter((coin) => (coin.price_change_percentage_24h || 0) < 0)
        .length,
      stable: data.filter(
        (coin) => Math.abs(coin.price_change_percentage_24h || 0) <= 5
      ).length,
    },
    topPerformers: data
      .filter((coin) => (coin.price_change_percentage_24h || 0) > 0)
      .sort(
        (a, b) =>
          (b.price_change_percentage_24h || 0) -
          (a.price_change_percentage_24h || 0)
      )
      .slice(0, 10)
      .map((coin) => ({
        name: coin.name,
        symbol: coin.symbol,
        change: coin.price_change_percentage_24h,
        price: coin.current_price,
      })),
    topLosers: data
      .filter((coin) => (coin.price_change_percentage_24h || 0) < 0)
      .sort(
        (a, b) =>
          (a.price_change_percentage_24h || 0) -
          (b.price_change_percentage_24h || 0)
      )
      .slice(0, 10)
      .map((coin) => ({
        name: coin.name,
        symbol: coin.symbol,
        change: coin.price_change_percentage_24h,
        price: coin.current_price,
      })),
    filters: filters,
    timestamp: new Date().toISOString(),
  };

  return report;
};
