import { test, expect } from '@playwright/test';

/**
 * AutomationExercise Test Case 12: Add Products in Cart
 *
 * Reference: https://www.automationexercise.com/test_cases
 *
 * Steps:
 * 1. Launch browser
 * 2. Navigate to url 'http://automationexercise.com'
 * 3. Verify that home page is visible successfully
 * 4. Click 'Products' button
 * 5. Hover over first product and click 'Add to cart'
 * 6. Click 'Continue Shopping' button
 * 7. Hover over second product and click 'Add to cart'
 * 8. Click 'View Cart' button
 * 9. Verify both products are added to Cart
 * 10. Verify their prices, quantity and total price
 */
test.describe('AutomationExercise — Test Case 12: Add Products in Cart', () => {
  test('add products to cart', async ({ page }) => {
    // Step 1: Launch browser (handled by Playwright)

    // Step 2: Navigate to url 'http://automationexercise.com'
    await page.goto('https://www.automationexercise.com/');

    // Step 3: Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/i);

    // Step 4: Click 'Products' button
    await page.getByRole('link', { name: /Products/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/products');
    }
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole('heading', { name: /All Products/i })).toBeVisible();

    const productCards = page.locator('.features_items .product-image-wrapper');
    expect(await productCards.count()).toBeGreaterThanOrEqual(2);
    const expectedProducts = [];

    // Steps 5-7: Hover over the first product, continue shopping, then add the second.
    for (let index = 0; index < 2; index += 1) {
      const card = productCards.nth(index);
      const name = (await card.locator('.productinfo p').innerText()).trim();
      const price = (await card.locator('.productinfo h2').innerText()).trim();
      expectedProducts.push({ name, price });

      await card.hover();
      await card.evaluate(async (element) => {
        await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished));
      });
      await card.locator('.overlay-content .add-to-cart').click();
      if (index === 0) {
        await page.getByRole('button', { name: 'Continue Shopping' }).click();
      }
    }

    // Step 8: Click 'View Cart' button
    await page.getByRole('link', { name: /Cart/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/view_cart');
    }

    // Steps 9-10: Verify both products, their prices, quantities, and total prices.
    const cartRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
    await expect(cartRows).toHaveCount(2);
    for (let index = 0; index < expectedProducts.length; index += 1) {
      const row = cartRows.nth(index);
      const expected = expectedProducts[index];
      await expect(row.locator('.cart_description h4 a')).toHaveText(expected.name);
      await expect(row.locator('.cart_price p')).toHaveText(expected.price);
      await expect(row.locator('.cart_quantity button')).toHaveText('1');

      const price = Number(expected.price.replace(/[^\d]/g, ''));
      const total = Number((await row.locator('.cart_total_price').innerText()).replace(/[^\d]/g, ''));
      expect(total).toBe(price);
    }
  });
});
