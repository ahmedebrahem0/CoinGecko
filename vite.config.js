import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  // Base path for GitHub Pages under /CoinGecko/
  base: "/CoinGecko/",
  server: {
    proxy: {
      "/api/coingecko": {
        target: "https://api.coingecko.com/api/v3",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, ""),
      },
    },
  },
});
