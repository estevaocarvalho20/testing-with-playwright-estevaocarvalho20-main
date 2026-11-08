import { test, expect } from '@playwright/test';

/**
 * AutomationExercise Test Case 20: Search Products and Verify Cart After Login
 *
 * Reference: https://www.automationexercise.com/test_cases
 *
 * Steps:
 * 1. Launch browser
 * 2. Navigate to url 'http://automationexercise.com'
 * 3. Click on 'Products' button
 * 4. Verify user is navigated to ALL PRODUCTS page successfully
 * 5. Enter product name in search input and click search button
 * 6. Verify 'SEARCHED PRODUCTS' is visible
 * 7. Verify all the products related to search are visible
 * 8. Add those products to cart
 * 9. Click 'Cart' button and verify that products are visible in cart
 * 10. Click 'Signup / Login' button and submit login details
 * 11. Again, go to Cart page
 * 12. Verify that those products are visible in cart after login as well
 */
test.describe('AutomationExercise — Test Case 20: Search Products and Verify Cart After Login', () => {
  test('search products and verify cart persistence after login', async ({ page }) => {
    const emailSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const userName = 'estevao';
    const email = `previaec+${emailSuffix}@mail.uc.edu`;
    const password = 'passowrd123';
    const searchTerm = 'Blue Top';

    // Step 1: Launch browser (handled by Playwright)

    // Step 2: Navigate to url 'http://automationexercise.com'
    await page.goto('https://www.automationexercise.com/');
    await expect(page).toHaveTitle(/Automation Exercise/i);

    // Create a unique account for this test so login does not depend on another test.
    await page.getByRole('link', { name: /Signup \/ Login/ }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/login');
    }
    await expect(page.getByText('New User Signup!', { exact: true })).toBeVisible();
    const signupForm = page.locator('form').filter({ hasText: 'Signup' });
    await signupForm.getByPlaceholder('Name').fill(userName);
    await signupForm.getByPlaceholder('Email Address').fill(email);
    await signupForm.getByRole('button', { name: 'Signup', exact: true }).click();
    await expect(page.getByText(/Enter Account Information/i)).toBeVisible();
    await page.getByRole('radio', { name: 'Mr.' }).check();
    await page.locator('#password').fill(password);
    await page.locator('#days').selectOption('22');
    await page.locator('#months').selectOption('3');
    await page.locator('#years').selectOption('2006');
    await page.locator('#first_name').fill('estevao');
    await page.locator('#last_name').fill('previatti');
    await page.locator('#company').fill('University of Cincinnati');
    await page.locator('#address1').fill('3442 Larona Ave');
    await page.locator('#address2').fill('Unit 1');
    await page.locator('#country').selectOption({ label: 'United States' });
    await page.locator('#state').fill('Ohio');
    await page.locator('#city').fill('Cincinnati');
    await page.locator('#zipcode').fill('42229');
    await page.locator('#mobile_number').fill('2832109711');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText(/Account Created!/i)).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page.getByRole('banner')).toContainText(`Logged in as ${userName}`);
    await page.getByRole('link', { name: /Logout/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/logout');
    }

    // Step 3: Click on 'Products' button
    await page.getByRole('link', { name: /Products/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/products');
    }

    // Step 4: Verify user is navigated to ALL PRODUCTS page successfully
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole('heading', { name: /All Products/i })).toBeVisible();

    // Step 5: Enter product name in search input and click search button
    await page.getByRole('textbox', { name: 'Search Product' }).fill(searchTerm);
    await page.locator('#submit_search').click();

    // Step 6: Verify 'SEARCHED PRODUCTS' is visible
    await expect(page.getByRole('heading', { name: /Searched Products/i })).toBeVisible();

    // Steps 7-8: Verify the matching products and add them to the cart.
    const products = page.locator('.features_items .product-image-wrapper');
    await expect(products).not.toHaveCount(0);
    const expectedProducts = [];
    const productCount = await products.count();
    for (let index = 0; index < productCount; index += 1) {
      const card = products.nth(index);
      const name = (await card.locator('.productinfo p').innerText()).trim();
      expect(name.toLowerCase()).toContain(searchTerm.toLowerCase());
      const price = (await card.locator('.productinfo h2').innerText()).trim();
      expectedProducts.push({ name, price });

      await card.hover();
      await card.evaluate(async (element) => {
        await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished));
      });
      await card.locator('.overlay-content .add-to-cart').click();
      await expect(page.locator('#cartModal')).toBeVisible();
      await page.locator('#cartModal').getByRole('button', { name: 'Continue Shopping' }).click();
    }

    // Step 9: Click 'Cart' button and verify that products are visible in cart.
    await page.getByRole('link', { name: /Cart/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/view_cart');
    }
    const guestCartRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
    await expect(guestCartRows).toHaveCount(expectedProducts.length);
    for (let index = 0; index < expectedProducts.length; index += 1) {
      await expect(guestCartRows.nth(index).locator('.cart_description h4 a')).toHaveText(
        expectedProducts[index].name,
      );
    }

    // Step 10: Click 'Signup / Login' button and submit login details.
    await page.getByRole('link', { name: /Signup \/ Login/ }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/login');
    }
    const loginForm = page.locator('form').filter({ hasText: 'Login' });
    await loginForm.getByPlaceholder('Email Address').fill(email);
    await loginForm.getByPlaceholder('Password').fill(password);
    await loginForm.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page.getByRole('banner')).toContainText(`Logged in as ${userName}`);

    // Step 11: Again, go to Cart page
    await page.getByRole('link', { name: /Cart/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/view_cart');
    }

    // Step 12: Verify that those products are visible in cart after login as well.
    const signedInCartRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
    await expect(signedInCartRows).toHaveCount(expectedProducts.length);
    for (let index = 0; index < expectedProducts.length; index += 1) {
      const row = signedInCartRows.nth(index);
      const expected = expectedProducts[index];
      await expect(row.locator('.cart_description h4 a')).toHaveText(expected.name);
      await expect(row.locator('.cart_price p')).toHaveText(expected.price);
      await expect(row.locator('.cart_quantity button')).toHaveText('1');
      const price = Number(expected.price.replace(/[^\d]/g, ''));
      const total = Number((await row.locator('.cart_total_price').innerText()).replace(/[^\d]/g, ''));
      expect(total).toBe(price);
    }

    // Clean up the account created for this test.
    await page.getByRole('link', { name: /Delete Account/ }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/delete_account');
    }
    await expect(page.getByText(/Account Deleted!/i)).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();
  });
});
