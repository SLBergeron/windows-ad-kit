import { test, expect } from '@playwright/test';

test.describe('Contractor Success Journey', () => {
  test('Contractor buys kit and books appointments', async ({ page }) => {
    // Customer visits our clear URL
    await page.goto('https://windowsadkit.com/get-started');
    
    // They see a clear promise
    await expect(page).toContainText('20 Appointments in 28 Days');
    
    // They enter their business info (clear labels)
    await page.fill('[name="business-name"]', "Bob's Windows & Doors");
    await page.fill('[name="city"]', "Dallas");
    
    // They purchase with confidence
    await page.click('button:has-text("Get My Ad Kit for $295")');
    
    // They immediately see value
    await expect(page).toContainText('Your ads will be live in 72 hours');
  });

  test('Contractor tracks their appointments', async ({ page }) => {
    await page.goto('https://windowsadkit.com/my-appointments');
    
    // Clear, non-technical display
    await expect(page).toContainText('Appointments Booked This Month: 23');
    await expect(page).toContainText('Cost Per Appointment: $47');
    await expect(page).toContainText('Revenue Generated: $34,500');
  });
});
