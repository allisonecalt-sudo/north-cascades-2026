import { test, expect } from '@playwright/test';
import { PAGES, PAGE_SET, targetFile } from './_helpers';

/**
 * Link integrity — the guard for the consolidation refactor. Renders EVERY
 * built page (links are injected by JS at runtime, so we must load the page),
 * collects every internal <a href>, and asserts each target page exists in the
 * build. A retired page that's still linked anywhere fails here loudly.
 *
 * Runs on desktop only (link graph is viewport-independent; no need to double).
 */
test.describe('internal link integrity', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'desktop', 'link graph is viewport-independent');

  for (const page of PAGES) {
    test(`no dangling internal links on ${page}`, async ({ page: pw }) => {
      await pw.goto(page, { waitUntil: 'networkidle' });
      const hrefs = await pw.$$eval('a[href]', (as) =>
        as.map((a) => a.getAttribute('href') || '')
      );
      const dangling: string[] = [];
      for (const href of hrefs) {
        const file = targetFile(href);
        if (file === null) continue;
        if (!PAGE_SET.has(file)) dangling.push(`${href} -> ${file}`);
      }
      expect(dangling, `Dangling internal links on ${page}:\n${dangling.join('\n')}`).toEqual([]);
    });
  }
});
