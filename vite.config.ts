import { defineConfig } from 'vite';

// GitHub Pages serves the site under /north-cascades-2026/. Local dev uses '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/north-cascades-2026/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}));
