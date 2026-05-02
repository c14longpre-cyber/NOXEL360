import { defineConfig } from "vite";
import path from "path";

// En dev local → localhost:4000
// En CI/preview → override via VITE_API_TARGET env var
const apiTarget = process.env.VITE_API_TARGET || "http://localhost:4000";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
