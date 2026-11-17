import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    proxy: {
      "/referral-proxy": {
        target: "https://staging.mycampushut.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/referral-proxy/, "/referral"),
      },
      "/news-proxy": {
        target: "https://api.mycampushut.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/news-proxy/, "/campusHutNews"),
      },
    },
  },
  preview: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
});
