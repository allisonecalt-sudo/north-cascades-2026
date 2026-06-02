import { test, expect } from '@playwright/test';

/**
 * Interaction + tap-target smoke. Confirms the key controls work and meet the
 * 44px touch-target floor (the Track-A mobile fix) so regressions surface.
 */

test.describe('interactions', () => {
  test('mobile hamburger opens the slide-over', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'hamburger is mobile-only');
    await page.goto('index.html', { waitUntil: 'domcontentloaded' });
    const burger = page.locator('.site-nav__hamburger');
    await expect(burger).toBeVisible();
    await burger.click();
    // The slide-over pins flat spine links (.site-nav__mobile-flat) at the top;
    // dropdown-bucket links (.site-nav__mobile-link) sit inside collapsed
    // <details> and only show when their bucket is expanded. Assert the panel
    // opened via the always-visible flat links.
    await expect(page.locator('.site-nav__mobile-flat').first()).toBeVisible();
  });

  test('lodging filter chips toggle + are ≥44px tall', async ({ page }, testInfo) => {
    await page.goto('lodging.html', { waitUntil: 'networkidle' });
    // Lodging is booked, so the comparison apparatus (incl. the chip filters) is
    // demoted behind a <details> disclosure. Expand it before exercising chips.
    await page.locator('.lodging-comparison > .disclosure__summary').click();
    const chip = page.locator('.chip').first();
    await expect(chip).toBeVisible();
    if (testInfo.project.name === 'mobile') {
      const box = await chip.boundingBox();
      expect(box!.height, 'chip tap target').toBeGreaterThanOrEqual(44);
    }
    // Clicking a chip flips its active state — the active-chip count changes,
    // which proves the filter is wired up (some chips, e.g. "Verified picks
    // only", start active, so assert a delta rather than a fixed count).
    const before = await page.locator('.chip--active').count();
    await chip.click();
    await expect.poll(() => page.locator('.chip--active').count()).not.toBe(before);
  });

  test('costs tier toggle present + ≥44px', async ({ page }, testInfo) => {
    await page.goto('costs.html', { waitUntil: 'networkidle' });
    const btns = page.locator('.costs-toggle__btn');
    expect(await btns.count(), 'tier buttons').toBeGreaterThanOrEqual(2);
    if (testInfo.project.name === 'mobile') {
      const box = await btns.first().boundingBox();
      expect(box!.height, 'tier toggle tap target').toBeGreaterThanOrEqual(44);
    }
  });

  test('things-to-do groups collapse + a deep link opens the right one', async ({ page }) => {
    await page.goto('things-to-do.html', { waitUntil: 'networkidle' });
    const groups = page.locator('details.ttd-group');
    expect(await groups.count(), 'collapsible groups').toBe(4);
    // Lakes starts collapsed; the #lakes section should be hidden until opened.
    await expect(page.locator('#lakes')).toBeHidden();
    // Following the deep link must reveal it (page JS opens the wrapping <details>).
    await page.goto('things-to-do.html#lakes', { waitUntil: 'networkidle' });
    await expect(page.locator('#lakes')).toBeVisible();
  });
});
