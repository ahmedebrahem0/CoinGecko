import React, { useState, useEffect } from "react";
import { testAPI } from "../services/apiTest";

const DebugPanel = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    const results = await testAPI();
    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-2">API Debug Panel</h3>

      <button
        onClick={runTest}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test API"}
      </button>

      {testResults && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">
            Test Results: {testResults.success ? "✅ Success" : "❌ Failed"}
          </h4>

          {testResults.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
              Error: {testResults.error}
            </div>
          )}

          {testResults.success && testResults.data && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Global Stats:</strong>{" "}
                {testResults.data.globalStats ? "✅ Loaded" : "❌ Failed"}
              </div>
              <div>
                <strong>Trending:</strong>{" "}
                {testResults.data.trending?.coins?.length || 0} coins loaded
              </div>
              <div>
                <strong>Top Coins:</strong>{" "}
                {testResults.data.topCoins?.length || 0} coins loaded
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;
