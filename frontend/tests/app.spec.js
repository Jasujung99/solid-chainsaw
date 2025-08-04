import { test, expect } from '@playwright/test';

test('filters results and supports compare', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.selectOption('select', 'alpha');
  await expect(page.locator('.grid-item')).toHaveCount(2);
  await page.selectOption('select', 'beta');
  await expect(page.locator('.grid-item')).toHaveCount(2);
  await page.click('button:has-text("Toggle Compare")');
  await page.locator('.grid-item').first().dragTo(page.locator('#compare-left'));
  await expect(page.locator('#compare-left img')).toBeVisible();
});
