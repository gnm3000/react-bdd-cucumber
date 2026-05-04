import { expect, test } from '@playwright/test';

test('product catalog displays available products', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Product Catalog' })).toBeVisible();
  await expect(page.getByTestId('add-Coffee Mug')).toBeVisible();
});
