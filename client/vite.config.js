import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

  server: {
    allowedHosts: ["interior-independently-opposition-gay.trycloudflare.com"],

    proxy: {
      "/api": {
        target: "https://entropy-ewme.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
