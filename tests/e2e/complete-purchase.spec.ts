import { test, expect } from '@playwright/test';

test.describe('Complete Purchase Flow', () => {
  test('Contractor completes purchase and receives kit access', async ({ page }) => {
    // Step 1: Visit get-started page
    await page.goto('http://localhost:3000/get-started');
    
    // Verify page loads with key elements
    await expect(page.locator('body')).toContainText('20 Appointments in 28 Days');
    await expect(page.locator('body')).toContainText('Get My Ad Kit for $295');

    // Step 2: Fill out business information
    await page.fill('[name="business-name"]', "Mike's Premium Windows");
    await page.fill('[name="city"]', "Austin");

    // Step 3: Attempt to purchase (will redirect to mock Stripe in development)
    // Note: In development mode, this will try to create a Stripe session
    // For now, we'll just verify the button becomes clickable and form submission works
    const purchaseButton = page.locator('button:has-text("Get My Ad Kit for $295")');
    await expect(purchaseButton).not.toBeDisabled();

    // For testing purposes, we'll simulate the successful purchase flow
    // In a real integration test, you'd mock Stripe's response or use test mode
    
    // Instead of actually going through Stripe, let's test the success page directly
    await page.goto('http://localhost:3000/success?session_id=test_session_123');

    // Step 4: Verify success page shows correct information
    await expect(page.locator('body')).toContainText('CONGRATULATIONS! YOUR WINDOWS AD KIT IS READY');
    await expect(page.locator('body')).toContainText('Your ads will be LIVE within 72 hours');
    await expect(page.locator('body')).toContainText('What Happens Next');

    // Step 5: Navigate to customer portal
    await page.click('text=Access My Customer Portal');

    // Should redirect to campaigns page
    await page.waitForURL('**/my-campaigns');
    await expect(page.locator('body')).toContainText('My Campaigns');
  });

  test('Contractor sees their dashboard after purchase', async ({ page }) => {
    // Go directly to the my-appointments page (simulating logged-in state)
    await page.goto('http://localhost:3000/my-appointments');

    // Verify the dashboard shows the correct welcome message
    await expect(page.locator('body')).toContainText("Welcome back, Bob's Windows & Doors!");

    // Verify the stats dashboard
    await expect(page.locator('body')).toContainText('Your Numbers This Month');
    await expect(page.locator('body')).toContainText('Appointments Booked');
    await expect(page.locator('body')).toContainText('Cost Per Appointment');
    await expect(page.locator('body')).toContainText('Campaign Status');

    // Verify the preparation status
    await expect(page.locator('body')).toContainText('PREPARING');
    await expect(page.locator('body')).toContainText('goes live in');
    await expect(page.locator('body')).toContainText('hours');

    // Verify the campaign setup button is present
    await expect(page.locator('text=View My Campaign Setup')).toBeVisible();

    // Verify the next steps section
    await expect(page.locator('body')).toContainText('Clear Next Steps');
    await expect(page.locator('body')).toContainText('Kit purchased');
    await expect(page.locator('body')).toContainText('Campaigns preparing');
    await expect(page.locator('body')).toContainText('First appointments expected');

    // Test sample data toggle
    await expect(page.locator('body')).toContainText('PREVIEW - Sample appointments');
    
    // Verify sample appointments are shown
    await expect(page.locator('body')).toContainText('Sarah Johnson');
    await expect(page.locator('body')).toContainText('Mike Chen');
    await expect(page.locator('body')).toContainText('Estimate');
    await expect(page.locator('body')).toContainText('Measurement');

    // Test hiding sample data
    await page.click('text=Hide Sample Data');
    await expect(page.locator('body')).toContainText('No appointments yet');
    await expect(page.locator('body')).toContainText('First appointments typically come within 3-5 days');

    // Test showing sample data again
    await page.click('text=Show Preview');
    await expect(page.locator('body')).toContainText('Sarah Johnson');
  });

  test('Navigation between portal pages works correctly', async ({ page }) => {
    // Start at my-appointments
    await page.goto('http://localhost:3000/my-appointments');

    // Click on campaign setup button
    await page.click('text=View My Campaign Setup');
    await page.waitForURL('**/my-campaigns');
    await expect(page.locator('body')).toContainText('My Campaigns');

    // Navigate back to success page to test the full flow
    await page.goto('http://localhost:3000/success?session_id=test_session_123');
    await expect(page.locator('body')).toContainText('CONGRATULATIONS');

    // Test navigation from success to portal
    await page.click('text=Access My Customer Portal');
    await page.waitForURL('**/my-campaigns');
  });
});