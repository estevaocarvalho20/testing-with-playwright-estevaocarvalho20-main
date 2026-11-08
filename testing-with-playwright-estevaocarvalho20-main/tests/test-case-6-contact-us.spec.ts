import { test, expect } from '@playwright/test';

/**
 * AutomationExercise Test Case 6: Contact Us Form
 *
 * Reference: https://www.automationexercise.com/test_cases
 *
 * Steps:
 * 1. Launch browser
 * 2. Navigate to url 'http://automationexercise.com'
 * 3. Verify that home page is visible successfully
 * 4. Click on 'Contact Us' button
 * 5. Verify 'GET IN TOUCH' is visible
 * 6. Enter name, email, subject and message
 * 7. Upload file
 * 8. Click 'Submit' button
 * 9. Click OK button
 * 10. Verify success message 'Success! Your details have been submitted successfully.' is visible
 * 11. Click 'Home' button and verify that landed to home page successfully
 */
test.describe('AutomationExercise — Test Case 6: Contact Us Form', () => {
  test('contact us form submission', async ({ page }) => {
    // Step 1: Launch browser (handled by Playwright)

    // Step 2: Navigate to url 'http://automationexercise.com'
    await page.goto('https://www.automationexercise.com/');

    // Step 3: Verify that home page is visible successfully
    await expect(page).toHaveTitle(/Automation Exercise/i);

    // Step 4: Click on 'Contact Us' button
    await page.getByRole('link', { name: /Contact us/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/contact_us');
    }

    // Step 5: Verify 'GET IN TOUCH' is visible
    await expect(page.getByRole('heading', { name: /Get In Touch/i })).toBeVisible();

    // Step 6: Enter name, email, subject and message
    await page.getByRole('textbox', { name: 'Name' }).fill('estevao');
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill('previaec@mail.uc.edu');
    await page.getByRole('textbox', { name: 'Subject' }).fill('difficulty');
    await page.getByRole('textbox', { name: 'Your Message Here' }).fill("can't create an account");

    // Step 7: Upload file
    await page.locator('input[type="file"]').setInputFiles('docs/beaker-icons.png');

    // Step 8: Click 'Submit' button and accept the confirmation dialog in Step 9.
    let dialogType;
    const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
      dialogType = dialog.type();
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Submit' }).click();
    await dialogPromise;
    expect(dialogType).toBe('confirm');

    // Step 10: Verify success message 'Success! Your details have been submitted successfully.' is visible
    await expect(page.locator('#contact-page .status.alert-success')).toHaveText(
      'Success! Your details have been submitted successfully.',
    );

    // Step 11: Click 'Home' button and verify that landed to home page successfully
    await page.getByRole('banner').getByRole('link', { name: /Home/i }).click();
    if (new URL(page.url()).hash === '#google_vignette') {
      await page.goto('https://www.automationexercise.com/');
    }
    await expect(page.getByRole('heading', { name: /Full-Fledged practice website/i })).toBeVisible();
  });
});
