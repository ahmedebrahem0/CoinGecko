import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ToastRenderer from "../components/ToastRenderer";

const MainLayout = () => {
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-2 md:p-4 max-w-12xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="h-16 shadow flex items-center justify-center text-sm"
        style={{
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
        }}
      >
        &copy; {new Date().getFullYear()} CoinGecko Clone. All rights reserved.
      </footer>

      {/* Toast Notifications */}
      <ToastRenderer />
    </div>
  );
};

export default MainLayout;
