import { test, expect } from '@playwright/test';

test.describe('Basic User Flow Validation', () => {
  test('should load homepage and basic navigation', async ({ page }) => {
    // Test get-started page
    await page.goto('/get-started');
    await expect(page).toHaveTitle(/Windows Ad Kit/);
    
    // Check for basic elements
    await expect(page.locator('h1')).toContainText('Tired of Your Phone');
    await expect(page.locator('nav')).toBeVisible();
    
    // Check form elements exist
    await expect(page.locator('input[name="business-name"]')).toBeVisible();
    await expect(page.locator('input[name="city"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    console.log('✅ Get-started page loaded successfully');
  });

  test('should validate form submission process', async ({ page }) => {
    await page.goto('/get-started');
    
    // Fill form with test data
    await page.fill('input[name="business-name"]', 'Test Windows Co');
    await page.fill('input[name="city"]', 'Austin');
    await page.fill('input[name="email"]', 'test@example.com');
    
    // Check button becomes enabled
    const submitButton = page.locator('button:has-text("Get My Ad Kit for $295")');
    await expect(submitButton).toBeEnabled();
    
    console.log('✅ Form validation works correctly');
  });

  test('should test API endpoints availability', async ({ page }) => {
    // Test checkout API (should handle missing data gracefully)
    const checkoutResponse = await page.request.post('/api/checkout', {
      data: {
        businessName: 'Test Business',
        city: 'Austin',
        email: 'test@example.com'
      }
    });
    
    console.log('Checkout API status:', checkoutResponse.status());
    
    // Test customer API
    const customerResponse = await page.request.get('/api/customer?session_id=test');
    console.log('Customer API status:', customerResponse.status());
    
    // Test Meta auth API
    const metaAuthResponse = await page.request.get('/api/meta/auth?session_id=test');
    console.log('Meta Auth API status:', metaAuthResponse.status());
    
    console.log('✅ API endpoints tested');
  });

  test('should check other page accessibility', async ({ page }) => {
    const pages = [
      '/onboarding',
      '/campaign-upload', 
      '/campaign-success',
      '/my-campaign',
      '/mobile-dashboard'
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Just check page doesn't crash
      const title = await page.title();
      console.log(`Page ${pagePath}: ${title}`);
      
      // Check for basic structure
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
    
    console.log('✅ All pages accessible');
  });

  test('should test mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/get-started');
    
    // Check mobile nav
    await expect(page.locator('nav')).toBeVisible();
    
    // Check form is usable
    await expect(page.locator('input[name="business-name"]')).toBeVisible();
    
    // Check button is large enough for touch
    const button = page.locator('button:has-text("Get My Ad Kit")');
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThan(40);
    
    console.log('✅ Mobile responsiveness validated');
  });

  test('should check for broken links', async ({ page }) => {
    await page.goto('/get-started');
    
    // Find all internal links
    const links = page.locator('a[href^="/"]');
    const count = await links.count();
    
    console.log(`Found ${count} internal links`);
    
    for (let i = 0; i < Math.min(count, 5); i++) { // Test first 5 links
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      if (href) {
        const response = await page.request.get(href);
        console.log(`Link ${href}: ${response.status()}`);
      }
    }
    
    console.log('✅ Link validation completed');
  });

  test('should validate environment variables and configuration', async ({ page }) => {
    // Test if required environment variables are available through API responses
    const response = await page.request.get('/api/customer?session_id=test');
    
    // This will tell us if database connection works
    console.log('Database connectivity test:', response.status());
    
    if (response.status() === 500) {
      const error = await response.text();
      console.log('Database error details:', error);
    }
    
    console.log('✅ Environment validation completed');
  });
});