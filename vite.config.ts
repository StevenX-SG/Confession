/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        format: "iife",
        name: "app",
        // Content-hashed filenames so every deploy produces unique asset URLs.
        // Without the hash the bundle was always "assets/index.js", so browsers
        // and the GitHub Pages CDN kept serving a stale cached copy after each
        // deploy. The hash changes whenever the code changes, busting the cache.
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
