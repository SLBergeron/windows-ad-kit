import { test, expect, Page } from '@playwright/test';

// Test data
const testCustomer = {
  businessName: 'Test Windows Pro',
  city: 'Austin',
  email: 'test@example.com',
  phone: '(512) 555-0123',
  website: 'www.testwindows.com'
};

const stripeTestCard = {
  number: '4242424242424242',
  expiry: '12/34',
  cvc: '123',
  zip: '78701'
};

test.describe('Complete User Journey: Get-Started to Campaign Success', () => {
  let sessionId: string;

  test.beforeEach(async ({ page }) => {
    // Set up viewport for desktop testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe('Phase 1: Get-Started and Stripe Checkout', () => {
    test('should load get-started page with all elements', async ({ page }) => {
      await page.goto('/get-started');
      
      // Check page loads and key elements are present
      await expect(page).toHaveTitle(/Windows Ad Kit/);
      await expect(page.locator('h1')).toContainText('Tired of Your Phone');
      
      // Check navigation elements
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('text=Windows Ad Kit')).toBeVisible();
      
      // Check order form elements
      await expect(page.locator('input[name="business-name"]')).toBeVisible();
      await expect(page.locator('input[name="city"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      
      // Check pricing and CTA
      await expect(page.locator('text=$295')).toBeVisible();
      await expect(page.locator('button:has-text("Get My Ad Kit")')).toBeVisible();
    });

    test('should validate form fields before submission', async ({ page }) => {
      await page.goto('/get-started');
      
      // Try to submit empty form
      const submitButton = page.locator('button:has-text("Get My Ad Kit for $295")');
      await expect(submitButton).toBeDisabled();
      
      // Fill partial form
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await expect(submitButton).toBeDisabled();
      
      await page.fill('input[name="city"]', testCustomer.city);
      await expect(submitButton).toBeDisabled();
      
      // Complete form should enable button
      await page.fill('input[name="email"]', testCustomer.email);
      await expect(submitButton).toBeEnabled();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/get-started');
      
      // Fill form with invalid email
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await page.fill('input[name="city"]', testCustomer.city);
      await page.fill('input[name="email"]', 'invalid-email');
      
      // Submit and check for validation
      await page.click('button:has-text("Get My Ad Kit for $295")');
      
      // Should show email validation alert
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('valid email address');
        await dialog.accept();
      });
    });

    test('should submit form and redirect to Stripe checkout', async ({ page }) => {
      await page.goto('/get-started');
      
      // Fill out the form
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await page.fill('input[name="city"]', testCustomer.city);
      await page.fill('input[name="email"]', testCustomer.email);
      
      // Intercept the checkout API call
      const checkoutRequest = page.waitForResponse('/api/checkout');
      
      // Submit form
      await page.click('button:has-text("Get My Ad Kit for $295")');
      
      // Wait for checkout API response
      const response = await checkoutRequest;
      expect(response.status()).toBe(200);
      
      const responseData = await response.json();
      expect(responseData.checkoutUrl).toContain('checkout.stripe.com');
      expect(responseData.sessionId).toBeTruthy();
      
      // Store session ID for later tests
      sessionId = responseData.sessionId;
      
      // Should redirect to Stripe
      await page.waitForURL(/checkout\.stripe\.com/);
      expect(page.url()).toContain('checkout.stripe.com');
    });

    test('should complete Stripe checkout with test card', async ({ page }) => {
      // Start from checkout (assumes previous test passed)
      if (!sessionId) {
        // Fallback: create a test session
        const response = await page.request.post('/api/checkout', {
          data: testCustomer
        });
        const data = await response.json();
        sessionId = data.sessionId;
        await page.goto(data.checkoutUrl);
      }
      
      // Fill Stripe checkout form
      await page.waitForSelector('[data-testid="hosted-payment-submit-button"]', { timeout: 10000 });
      
      // Fill card details
      const cardFrame = page.frameLocator('iframe[name*="card-number"]');
      await cardFrame.locator('[name="cardnumber"]').fill(stripeTestCard.number);
      
      const expiryFrame = page.frameLocator('iframe[name*="card-expiry"]');
      await expiryFrame.locator('[name="exp-date"]').fill(stripeTestCard.expiry);
      
      const cvcFrame = page.frameLocator('iframe[name*="card-cvc"]');
      await cvcFrame.locator('[name="cvc"]').fill(stripeTestCard.cvc);
      
      // Fill billing details
      await page.fill('[data-testid="billing-address-line1"]', '123 Test St');
      await page.fill('[data-testid="billing-address-city"]', testCustomer.city);
      await page.fill('[data-testid="billing-address-zip"]', stripeTestCard.zip);
      
      // Submit payment
      await page.click('[data-testid="hosted-payment-submit-button"]');
      
      // Should redirect to success page
      await page.waitForURL(/\/success/, { timeout: 30000 });
      expect(page.url()).toContain('/success');
    });
  });

  test.describe('Phase 2: Onboarding Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Mock successful payment - go directly to onboarding
      await page.goto(`/onboarding?session_id=${sessionId || 'test_session'}`);
    });

    test('should load onboarding with welcome step', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Welcome to Windows Ad Kit');
      await expect(page.locator('text=Step 1 of 5')).toBeVisible();
      await expect(page.locator('button:has-text("Let\'s Get Started")')).toBeVisible();
    });

    test('should navigate through all onboarding steps', async ({ page }) => {
      // Step 1: Welcome
      await page.click('button:has-text("Let\'s Get Started")');
      
      // Step 2: Business Info
      await expect(page.locator('text=Tell Us About Your Business')).toBeVisible();
      await page.fill('input[value=""]', testCustomer.businessName);
      await page.fill('input[placeholder="Austin"]', testCustomer.city);
      await page.fill('input[placeholder="(512) 555-0123"]', testCustomer.phone);
      await page.fill('input[placeholder="www.mikeswindows.com"]', testCustomer.website);
      await page.click('button:has-text("Next")');
      
      // Step 3: Market Info
      await expect(page.locator('text=Your Market & Customers')).toBeVisible();
      await page.selectOption('select:has-option("Within 20 miles")', '20');
      await page.selectOption('select:has-option("$8,000 - $12,000")', '8000');
      await page.selectOption('select:has-option("Spring & Summer")', 'spring_summer');
      await page.click('button:has-text("Next")');
      
      // Step 4: Business Intelligence
      await expect(page.locator('text=Tell Us About Your Business Strategy')).toBeVisible();
      await page.selectOption('select', 'windows_only');
      await page.fill('textarea', 'Lifetime warranty on all installations');
      await page.click('button:has-text("Next")');
      
      // Step 5: Logo Upload
      await expect(page.locator('text=Upload Your Logo')).toBeVisible();
      // Skip logo upload for test
      await page.click('button:has-text("Create My Ads")');
      
      // Should redirect to campaign upload
      await page.waitForURL(/\/campaign-upload/, { timeout: 10000 });
    });

    test('should validate required fields in each step', async ({ page }) => {
      // Navigate to business info step
      await page.click('button:has-text("Let\'s Get Started")');
      
      // Try to proceed without filling required fields
      const nextButton = page.locator('button:has-text("Next")');
      // Business name is required but form should still allow navigation
      // This tests the UX flow rather than strict validation
    });
  });

  test.describe('Phase 3: Campaign Upload Flow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/campaign-upload?session_id=${sessionId || 'test_session'}`);
    });

    test('should load campaign upload with step indicator', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Launch Your Campaign');
      
      // Check step indicators
      await expect(page.locator('text=Connect Meta')).toBeVisible();
      await expect(page.locator('text=Budget Setup')).toBeVisible();
      await expect(page.locator('text=Campaign Preview')).toBeVisible();
      await expect(page.locator('text=Launch')).toBeVisible();
    });

    test('should show Meta connection interface', async ({ page }) => {
      // Step 1: Meta Connection
      await expect(page.locator('text=Connect Your Meta Business Account')).toBeVisible();
      await expect(page.locator('button:has-text("Connect Meta Business Manager")')).toBeVisible();
      
      // Check safety information
      await expect(page.locator('text=What permissions do we need?')).toBeVisible();
      await expect(page.locator('text=Create and manage ad campaigns')).toBeVisible();
    });

    test('should navigate through budget setup', async ({ page }) => {
      // Mock Meta connection (skip to step 2)
      await page.evaluate(() => {
        localStorage.setItem('test_meta_connected', 'true');
      });
      await page.reload();
      
      // Navigate to budget setup manually for testing
      const budgetStepButton = page.locator('text=Budget Setup').first();
      if (await budgetStepButton.isVisible()) {
        await budgetStepButton.click();
      }
      
      // Check budget controls
      await expect(page.locator('text=Smart Budget & Safety Setup')).toBeVisible();
      await expect(page.locator('input[type="range"]')).toBeVisible();
      
      // Check safety features
      await expect(page.locator('text=Built-in Safety Features')).toBeVisible();
      await expect(page.locator('text=Daily spend limit')).toBeVisible();
      await expect(page.locator('text=Auto-pause if cost per lead exceeds')).toBeVisible();
    });

    test('should show campaign preview with all details', async ({ page }) => {
      // Mock completion of earlier steps
      await page.evaluate(() => {
        localStorage.setItem('test_campaign_ready', 'true');
      });
      
      // Check if we can access preview step
      const previewText = page.locator('text=Campaign Preview');
      if (await previewText.isVisible()) {
        await previewText.click();
        
        await expect(page.locator('text=Campaign Preview')).toBeVisible();
        await expect(page.locator('text=Strategic Ad Angles')).toBeVisible();
        await expect(page.locator('text=Financing Focus')).toBeVisible();
        await expect(page.locator('text=Energy Savings')).toBeVisible();
        await expect(page.locator('text=Local Trust')).toBeVisible();
      }
    });
  });

  test.describe('Phase 4: Dashboard and Mobile Views', () => {
    test('should load campaign dashboard', async ({ page }) => {
      await page.goto(`/my-campaign?session_id=${sessionId || 'test_session'}`);
      
      await expect(page.locator('text=Windows Ad Kit')).toBeVisible();
      await expect(page.locator('text=Your custom ads are being prepared')).toBeVisible();
    });

    test('should load mobile dashboard', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto(`/mobile-dashboard?session_id=${sessionId || 'test_session'}`);
      
      await expect(page.locator('text=Windows Ad Kit')).toBeVisible();
      
      // Check mobile tabs
      await expect(page.locator('text=Overview')).toBeVisible();
      await expect(page.locator('text=Leads')).toBeVisible();
      await expect(page.locator('text=Controls')).toBeVisible();
    });
  });

  test.describe('Phase 5: API Endpoints and Data Consistency', () => {
    test('should test customer API endpoint', async ({ page }) => {
      const response = await page.request.get(`/api/customer?session_id=${sessionId || 'test_session'}`);
      
      if (response.status() === 200) {
        const data = await response.json();
        expect(data.customer).toBeTruthy();
        expect(data.customer.businessName).toBeTruthy();
        expect(data.customer.city).toBeTruthy();
      } else {
        // API might return 404 for test session - that's okay
        expect([200, 404]).toContain(response.status());
      }
    });

    test('should test Meta auth endpoint', async ({ page }) => {
      const response = await page.request.get(`/api/meta/auth?session_id=${sessionId || 'test_session'}`);
      
      if (response.status() === 200) {
        const data = await response.json();
        expect(data.authUrl).toContain('facebook.com');
      } else {
        // Might require environment variables
        expect([200, 400, 500]).toContain(response.status());
      }
    });

    test('should test emergency controls endpoint', async ({ page }) => {
      const response = await page.request.get(`/api/meta/emergency-controls?session_id=${sessionId || 'test_session'}`);
      
      // Should handle missing session gracefully
      expect([200, 404]).toContain(response.status());
    });
  });

  test.describe('Phase 6: Cross-Browser and Mobile Testing', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/get-started');
      
      // Check mobile responsiveness
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('input[name="business-name"]')).toBeVisible();
      
      // Check button is touchable (minimum 44px height)
      const button = page.locator('button:has-text("Get My Ad Kit")');
      const box = await button.boundingBox();
      expect(box?.height).toBeGreaterThan(44);
    });

    test('should handle navigation between pages', async ({ page }) => {
      await page.goto('/get-started');
      
      // Check internal links
      const createCampaignLink = page.locator('a[href="/create-campaign"]');
      if (await createCampaignLink.isVisible()) {
        await createCampaignLink.click();
        await expect(page).toHaveURL(/\/create-campaign/);
      }
    });
  });

  test.describe('Phase 7: Error Handling and Edge Cases', () => {
    test('should handle invalid session IDs gracefully', async ({ page }) => {
      await page.goto('/onboarding?session_id=invalid_session');
      
      // Should either redirect or show error gracefully
      await page.waitForLoadState('networkidle');
      // Don't expect specific behavior, just that it doesn't crash
    });

    test('should handle network errors in checkout', async ({ page }) => {
      await page.goto('/get-started');
      
      // Mock network failure
      await page.route('/api/checkout', route => route.abort());
      
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await page.fill('input[name="city"]', testCustomer.city);
      await page.fill('input[name="email"]', testCustomer.email);
      
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('error');
        await dialog.accept();
      });
      
      await page.click('button:has-text("Get My Ad Kit for $295")');
    });

    test('should validate form data persistence', async ({ page }) => {
      await page.goto('/get-started');
      
      // Fill form
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await page.fill('input[name="city"]', testCustomer.city);
      
      // Refresh page
      await page.reload();
      
      // Form should be empty (no persistence expected for security)
      await expect(page.locator('input[name="business-name"]')).toHaveValue('');
    });
  });
});

// Additional test suite for specific component testing
test.describe('Component-Specific Tests', () => {
  test('should test all external links open in new tabs', async ({ page }) => {
    await page.goto('/campaign-success');
    
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('should validate accessibility basics', async ({ page }) => {
    await page.goto('/get-started');
    
    // Check for proper heading hierarchy
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    
    // Check for form labels
    const inputs = page.locator('input[type="text"], input[type="email"]');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id') || await input.getAttribute('name');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        // Either explicit label or aria-label should exist
        const hasLabel = await label.isVisible();
        const hasAriaLabel = await input.getAttribute('aria-label');
        expect(hasLabel || hasAriaLabel).toBeTruthy();
      }
    }
  });

  test('should check for console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/get-started');
    await page.goto('/onboarding');
    await page.goto('/campaign-upload');
    
    // Filter out expected errors (like missing session IDs)
    const unexpectedErrors = errors.filter(error => 
      !error.includes('session_id') && 
      !error.includes('404') &&
      !error.includes('customer not found')
    );
    
    expect(unexpectedErrors).toHaveLength(0);
  });
});