import { test, expect } from '@playwright/test';
import { PAGES } from './_helpers';

/**
 * Per-page smoke — runs on BOTH viewports (mobile 390 + desktop). Each page:
 *   - loads with a visible <h1>
 *   - throws no uncaught JS error (pageerror) and logs no real console error
 *     (resource/network 404s for external images/tiles are filtered out)
 *   - has no horizontal overflow on mobile (the sideways-scroll bug class)
 */

// console noise we don't care about (external assets, favicon, leaflet tiles).
function isBenign(text: string): boolean {
  return (
    /failed to load resource/i.test(text) ||
    /net::ERR/i.test(text) ||
    /favicon/i.test(text) ||
    /tile|leaflet|unpkg|wikimedia|upload\.wikimedia/i.test(text) ||
    /Download the React DevTools/i.test(text)
  );
}

for (const pageFile of PAGES) {
  test(`smoke: ${pageFile}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !isBenign(msg.text())) errors.push(`console: ${msg.text()}`);
    });

    await page.goto(pageFile, { waitUntil: 'networkidle' });

    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors, `JS/console errors on ${pageFile}:\n${errors.join('\n')}`).toEqual([]);

    if (testInfo.project.name === 'mobile') {
      const overflow = await page.evaluate(() => {
        const el = document.scrollingElement || document.documentElement;
        return el.scrollWidth - el.clientWidth;
      });
      expect(overflow, `${pageFile} overflows horizontally on mobile by ${overflow}px`).toBeLessThanOrEqual(1);
    }
  });
}
