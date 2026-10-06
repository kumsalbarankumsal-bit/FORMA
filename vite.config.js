import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Göreli taban: aynı derleme Vercel'de, GitHub Pages'te ya da bir alt klasörde çalışır.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { chunkSizeWarningLimit: 6000, sourcemap: false },
});
