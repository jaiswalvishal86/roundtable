import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        thanks: resolve(__dirname, "src/pages/thanks.html"),
      },
    },
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
