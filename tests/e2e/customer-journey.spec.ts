import { test, expect } from '@playwright/test';

test.describe('Contractor Success Journey', () => {
  test('Contractor buys kit and books appointments', async ({ page }) => {
    // Customer visits our clear URL
    await page.goto('http://localhost:3000/get-started');
    
    // They see the compelling headline and value proposition
    await expect(page.locator('body')).toContainText('Tired of Your Phone');
    await expect(page.locator('body')).toContainText('Not Ringing?');
    await expect(page.locator('body')).toContainText('20+ appointments every month');
    
    // They scroll to the order form and enter their business info
    await page.click('text=Get My Windows Ad Kit Now → Only $295');
    
    // Fill out the form
    await page.fill('[name="business-name"]', "Bob's Windows & Doors");
    await page.fill('[name="city"]', "Dallas");
    await page.fill('[name="email"]', "bob@example.com");
    
    // They see the purchase button is enabled
    await expect(page.locator('button:has-text("🔐 Get My Ad Kit for $295 →")')).not.toBeDisabled();
  });

  test('Contractor tracks their appointments', async ({ page }) => {
    await page.goto('http://localhost:3000/my-appointments');
    
    // Clear, non-technical display
    await expect(page.locator('body')).toContainText('Your Numbers This Month');
    await expect(page.locator('body')).toContainText('Appointments Booked');
    await expect(page.locator('body')).toContainText('Cost Per Appointment');
    await expect(page.locator('body')).toContainText('Campaign Status');
  });
});
