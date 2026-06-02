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
    await expect(page.locator('.site-nav__mobile-link').first()).toBeVisible();
  });

  test('lodging filter chips toggle + are ≥44px tall', async ({ page }, testInfo) => {
    await page.goto('lodging.html', { waitUntil: 'networkidle' });
    const chip = page.locator('.chip').first();
    await expect(chip).toBeVisible();
    if (testInfo.project.name === 'mobile') {
      const box = await chip.boundingBox();
      expect(box!.height, 'chip tap target').toBeGreaterThanOrEqual(44);
    }
    await chip.click();
    // a chip becoming active proves the filter wired up (class may land on it or a sibling)
    await expect(page.locator('.chip--active')).toHaveCount(1);
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
});
