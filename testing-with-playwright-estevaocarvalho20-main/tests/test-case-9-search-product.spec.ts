import { test, expect } from '@playwright/test';

/**
 * AutomationExercise Test Case 9: Search Product
 *
 * Reference: https://www.automationexercise.com/test_cases
 *
 * Steps:
 * 1. Launch browser
 * 2. Navigate to url 'http://automationexercise.com'
 * 3. Verify that home page is visible successfully
 * 4. Click on 'Products' button
 * 5. Verify user is navigated to ALL PRODUCTS page successfully
 * 6. Enter product name in search input and click search button
 * 7. Verify 'SEARCHED PRODUCTS' is visible
 * 8. Verify all the products related to search are visible
 */
test.describe('AutomationExercise — Test Case 9: Search Product', () => {
  test('search product functionality', async ({ page }) => {
    const searchTerm = 'Blue Top';

    // Step 1: Launch browser (handled by Playwright)

    // Step 2: Navigate to url 'http://automationexercise.com'
    await page.goto('https://www.automationexercise.com/');

    // Step 3: Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/i);

    // Step 4: Click on 'Products' button
    await page.getByRole('link', { name: /Products/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/products');
    }

    // Step 5: Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole('heading', { name: /All Products/i })).toBeVisible();

    // Step 6: Enter product name in search input and click search button
    await page.getByRole('textbox', { name: 'Search Product' }).fill(searchTerm);
    await page.locator('#submit_search').click();

    // Step 7: Verify 'SEARCHED PRODUCTS' is visible
    await expect(page.getByRole('heading', { name: /Searched Products/i })).toBeVisible();

    // Step 8: Verify all the products related to search are visible
    const products = page.locator('.features_items .product-image-wrapper');
    await expect(products).not.toHaveCount(0);
    const productCount = await products.count();
    for (let index = 0; index < productCount; index += 1) {
      const productName = await products.nth(index).locator('.productinfo p').innerText();
      expect(productName.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });
});
