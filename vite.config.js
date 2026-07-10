import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Keeps asset paths relative for GitHub Pages and other static hosts.
  base: "./",
  plugins: [
    react({
      include: ["**/*.js", "**/*.jsx"],
    }),
  ],
  build: {
    // Match the existing gh-pages deploy script (gh-pages -d build)
    outDir: "build",
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
