/// <reference types="node" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
const rootDir = process.cwd();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
      "@/features": path.join(rootDir, "src/features"),
      "@/shared-types": path.join(rootDir, "..", "shared-types"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
