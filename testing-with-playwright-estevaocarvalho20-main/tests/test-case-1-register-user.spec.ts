import { test, expect } from '@playwright/test';

/**
 * AutomationExercise Test Case 1: Register User
 *
 * Reference: https://www.automationexercise.com/test_cases
 *
 * Steps:
 * 1. Launch browser
 * 2. Navigate to url 'http://automationexercise.com'
 * 3. Verify that home page is visible successfully
 * 4. Click on 'Signup / Login' button
 * 5. Verify 'New User Signup!' is visible
 * 6. Enter name and email address
 * 7. Click 'Signup' button
 * 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
 * 9. Fill details: Title, Name, Email, Password, Date of birth
 * 10. Select checkbox 'Sign up for our newsletter!'
 * 11. Select checkbox 'Receive special offers from our partners!'
 * 12. Fill personal and address details
 * 13. Click 'Create Account' button
 * 14. Verify that 'ACCOUNT CREATED!' is visible
 * 15. Click 'Continue' button
 * 16. Verify that 'Logged in as username' is visible
 * 17. Click 'Delete Account' button
 * 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
 */
test.describe('AutomationExercise — Test Case 1: Register User', () => {
  test('register and delete a user account', async ({ page }) => {
    const emailSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const userName = 'estevao';
    const email = `previaec+${emailSuffix}@mail.uc.edu`;
    const password = 'passowrd123';

    // Step 1: Launch browser (handled by Playwright)

    // Step 2: Navigate to url 'http://automationexercise.com'
    await page.goto('https://www.automationexercise.com/');

    // Step 3: Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/i);

    // Step 4: Click on 'Signup / Login' button
    await page.getByRole('link', { name: /Signup \/ Login/ }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/login');
    }

    // Step 5: Verify 'New User Signup!' is visible
    await expect(page.getByText('New User Signup!', { exact: true })).toBeVisible();

    // Steps 6-7: Enter a unique name and email address, then click 'Signup'.
    const signupForm = page.locator('form').filter({ hasText: 'Signup' });
    await signupForm.getByPlaceholder('Name').fill(userName);
    await signupForm.getByPlaceholder('Email Address').fill(email);
    await signupForm.getByRole('button', { name: 'Signup', exact: true }).click();

    // Step 8: Verify that 'ENTER ACCOUNT INFORMATION' is visible
    await expect(page.getByText(/Enter Account Information/i)).toBeVisible();

    // Step 9: Fill details: Title, Name, Email, Password, Date of birth
    await page.getByRole('radio', { name: 'Mr.' }).check();
    await page.locator('#password').fill(password);
    await page.locator('#days').selectOption('22');
    await page.locator('#months').selectOption('3');
    await page.locator('#years').selectOption('2006');

    // Step 10: Select checkbox 'Sign up for our newsletter!'
    await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();

    // Step 11: Select checkbox 'Receive special offers from our partners!'
    await page.getByRole('checkbox', { name: /Receive special offers/ }).check();

    // Step 12: Fill personal and address details
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

    // Step 13: Click 'Create Account' button
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Step 14: Verify that 'ACCOUNT CREATED!' is visible
    await expect(page.getByText(/Account Created!/i)).toBeVisible();

    // Step 15: Click 'Continue' button
    await page.getByRole('link', { name: 'Continue' }).click();

    // Step 16: Verify that 'Logged in as username' is visible
    await expect(page.getByRole('banner')).toContainText(`Logged in as ${userName}`);

    // Step 17: Click 'Delete Account' button
    await page.getByRole('link', { name: /Delete Account/ }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/delete_account');
    }

    // Step 18: Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    await expect(page.getByText(/Account Deleted!/i)).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();
  });
});
