import React from "react";
import {
  FiAlertCircle,
  FiRefreshCw,
  FiHome,
  FiArrowLeft,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const Error = ({
  message = "Something went wrong",
  onRetry,
  showHomeButton = true,
  showBackButton = true,
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full">
        {/* Error Container */}
        <div
          className="relative overflow-hidden rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-300 hover:border-solid hover:shadow-xl"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <FiAlertCircle className="w-10 h-10 text-red-500" />
            </div>

            {/* Error Title */}
            <h3
              className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Oops! Something went wrong
            </h3>

            {/* Error Message */}
            <p
              className="text-base sm:text-lg mb-8 leading-relaxed"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* Retry Button */}
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              )}

              {/* Back Button */}
              {showBackButton && (
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105 border-2 border-gray-200 hover:border-gray-300"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </button>
              )}

              {/* Home Button */}
              {showHomeButton && (
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FiHome className="w-4 h-4" />
                  <span>Go Home</span>
                </Link>
              )}
            </div>

            {/* Help Text */}
            <div
              className="mt-8 pt-6 border-t-2 border-gray-200"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If the problem persists, please contact support
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-xl" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-400 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;
