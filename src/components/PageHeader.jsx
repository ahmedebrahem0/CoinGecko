import React from "react";

const PageHeader = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`max-w-7xl mx-auto mb-6 ${className}`}>
      {/* Main Header Container */}
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-all duration-300 hover:border-solid hover:shadow-xl"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-purple-400" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full" />
              <p
                className="text-sm sm:text-base lg:text-lg leading-relaxed"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {subtitle}
              </p>
            </div>
          )}

          {/* Children Content */}
          {children && (
            <div
              className="mt-6 pt-6 border-t-2 border-gray-200"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              {children}
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-full blur-xl" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
