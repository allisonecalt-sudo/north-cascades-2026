import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

// GitHub Pages serves the site under /north-cascades-2026/. Local dev uses '/'.
// Multi-page (May 16, 2026 — Austria-inspired digestibility pass). Each .html
// is a separate Rollup input so Vite emits a working dist for each.
const here = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

// `vite preview` serves the production build, so it must use the production base
// (/north-cascades-2026/) — otherwise the built HTML's /north-cascades-2026/...
// asset URLs 404 (served as the HTML fallback) and no module ever executes.
// `command` is 'serve' for both `vite` (dev) and `vite preview`, so detect
// preview via argv. Dev stays at '/'.
const isPreview = process.argv.includes('preview');

export default defineConfig(({ command }) => ({
  base: command === 'build' || isPreview ? '/north-cascades-2026/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        home: here('index.html'),
        lodging: here('lodging.html'),
        hikes: here('hikes.html'),
        thingsToDo: here('things-to-do.html'),
        travel: here('travel.html'),
        rental: here('rental.html'),
        food: here('food.html'),
        seattle: here('seattle.html'),
        forErin: here('for-erin.html'),
        notes: here('notes.html'),
        costs: here('costs.html'),
        preTrip: here('pre-trip.html'),
        hiddenGems: here('hidden-gems.html'),
        map: here('map.html'),
        weatherPlanC: here('weather-plan-c.html'),
        search: here('search.html'),
        wa20Status: here('wa20-status.html'),
      },
    },
  },
}));
