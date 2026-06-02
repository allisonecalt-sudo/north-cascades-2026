import { defineConfig, devices } from '@playwright/test';

/**
 * E2E web-test harness (2026-06-02). Tests run against the REAL built site
 * served by `vite preview` under the production base path
 * (/north-cascades-2026/). Build first via the `test:e2e` script so `dist/`
 * exists when the specs enumerate pages.
 *
 * Two projects — a 390px Android-ish phone (the primary device) and a desktop —
 * so every smoke/overflow assertion runs at both widths.
 */
const PORT = 4173;
const BASE = `http://localhost:${PORT}/north-cascades-2026/`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'line',
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
