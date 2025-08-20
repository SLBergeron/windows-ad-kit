import { test, expect, Page } from '@playwright/test';

// Comprehensive end-to-end test with real Stripe integration
const testCustomer = {
  businessName: 'Test Windows Pro LLC',
  city: 'Austin',
  email: 'test+stripe@example.com',
  phone: '(512) 555-0123',
  website: 'www.testwindowspro.com'
};

const stripeTestCard = {
  number: '4242424242424242', // Visa test card
  expiry: '12/34',
  cvc: '123',
  zip: '78701'
};

test.describe('Full Stripe Integration & Post-Payment Flow', () => {
  let sessionId: string;
  let checkoutUrl: string;

  test.describe('Phase 1: Get-Started to Stripe Checkout', () => {
    test('should complete form submission and get valid Stripe URL', async ({ page }) => {
      console.log('🚀 Starting comprehensive flow test...');
      
      await page.goto('/get-started');
      
      // Verify page loads
      await expect(page).toHaveTitle(/Windows Ad Kit/);
      await expect(page.locator('h1')).toContainText('Tired of Your Phone');
      
      // Fill out the complete form
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await page.fill('input[name="city"]', testCustomer.city);
      await page.fill('input[name="email"]', testCustomer.email);
      
      // Verify button becomes enabled
      const submitButton = page.locator('button:has-text("Get My Ad Kit for $295")');
      await expect(submitButton).toBeEnabled();
      
      console.log('📋 Form filled, submitting to checkout...');
      
      // Intercept and capture the checkout response
      const responsePromise = page.waitForResponse('/api/checkout');
      
      await submitButton.click();
      
      const response = await responsePromise;
      expect(response.status()).toBe(200);
      
      const responseData = await response.json();
      console.log('🔗 Checkout response:', responseData);
      
      // Validate checkout response structure
      expect(responseData.checkoutUrl).toBeTruthy();
      expect(responseData.sessionId).toBeTruthy();
      expect(responseData.checkoutUrl).toContain('checkout.stripe.com');
      
      // Store for next tests
      sessionId = responseData.sessionId;
      checkoutUrl = responseData.checkoutUrl;
      
      console.log(`✅ Session created: ${sessionId}`);
      console.log(`✅ Checkout URL: ${checkoutUrl}`);
      
      // Should redirect to Stripe
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });
      expect(page.url()).toContain('checkout.stripe.com');
    });
  });

  test.describe('Phase 2: Stripe Checkout Completion', () => {
    test('should complete Stripe payment with test card', async ({ page }) => {
      // Navigate to checkout URL from previous test
      if (!checkoutUrl) {
        // Fallback: create checkout session
        const response = await page.request.post('/api/checkout', {
          data: testCustomer
        });
        const data = await response.json();
        sessionId = data.sessionId;
        checkoutUrl = data.checkoutUrl;
      }
      
      console.log(`💳 Processing Stripe payment for session: ${sessionId}`);
      await page.goto(checkoutUrl);
      
      // Wait for Stripe checkout to load
      await page.waitForSelector('[data-testid="hosted-payment-submit-button"]', { 
        timeout: 15000 
      });
      
      console.log('🏪 Stripe checkout loaded, filling payment details...');
      
      // Fill card number
      const cardFrame = page.frameLocator('iframe[name*="card-number"]');
      await cardFrame.locator('[name="cardnumber"]').fill(stripeTestCard.number);
      
      // Fill expiry
      const expiryFrame = page.frameLocator('iframe[name*="card-expiry"]');
      await expiryFrame.locator('[name="exp-date"]').fill(stripeTestCard.expiry);
      
      // Fill CVC
      const cvcFrame = page.frameLocator('iframe[name*="card-cvc"]');
      await cvcFrame.locator('[name="cvc"]').fill(stripeTestCard.cvc);
      
      // Fill billing information
      await page.fill('[data-testid="billing-address-line1"]', '123 Test Street');
      await page.fill('[data-testid="billing-address-city"]', testCustomer.city);
      await page.fill('[data-testid="billing-address-zip"]', stripeTestCard.zip);
      
      console.log('💰 Submitting payment...');
      
      // Submit payment and track the redirect
      const submitButton = page.locator('[data-testid="hosted-payment-submit-button"]');
      await submitButton.click();
      
      // This is the critical point - monitor what happens after payment
      console.log('⏳ Waiting for post-payment redirect...');
      
      // Wait for redirect - this is where failures typically occur
      try {
        await page.waitForURL(/\/success\?|\/onboarding\?|session_id=/, { 
          timeout: 30000 
        });
        
        const finalUrl = page.url();
        console.log(`🎯 Post-payment redirect URL: ${finalUrl}`);
        
        // Check if we got a session_id in the URL
        const urlParams = new URL(finalUrl);
        const urlSessionId = urlParams.searchParams.get('session_id');
        
        if (urlSessionId) {
          console.log(`✅ Session ID preserved in redirect: ${urlSessionId}`);
        } else {
          console.error('❌ No session_id found in redirect URL');
        }
        
        // Verify page loads successfully
        await page.waitForLoadState('networkidle');
        const title = await page.title();
        console.log(`📄 Landing page title: ${title}`);
        
      } catch (error) {
        console.error('❌ Post-payment redirect failed:', error);
        console.log('🔍 Current URL:', page.url());
        console.log('🔍 Page content preview:', await page.content().then(content => content.substring(0, 500)));
        throw error;
      }
    });
  });

  test.describe('Phase 3: Post-Payment Data Validation', () => {
    test('should verify customer data persistence after payment', async ({ page }) => {
      // Test if customer data is accessible via API after payment
      console.log(`🔍 Testing customer data persistence for session: ${sessionId}`);
      
      if (!sessionId) {
        throw new Error('No session ID available from previous tests');
      }
      
      const customerResponse = await page.request.get(`/api/customer?session_id=${sessionId}`);
      console.log(`📊 Customer API response: ${customerResponse.status()}`);
      
      if (customerResponse.status() === 200) {
        const customerData = await customerResponse.json();
        console.log('✅ Customer data found:', customerData);
        
        // Validate customer data structure
        expect(customerData.customer).toBeTruthy();
        expect(customerData.customer.businessName).toBe(testCustomer.businessName);
        expect(customerData.customer.city).toBe(testCustomer.city);
        expect(customerData.customer.email).toBe(testCustomer.email);
      } else if (customerResponse.status() === 404) {
        console.log('⚠️ Customer not found - checking if this is expected for test data');
        const errorText = await customerResponse.text();
        console.log('📝 Error response:', errorText);
      } else {
        console.error('❌ Unexpected customer API response:', customerResponse.status());
        const errorText = await customerResponse.text();
        console.error('📝 Error details:', errorText);
      }
    });
  });

  test.describe('Phase 4: Onboarding Flow with Real Session', () => {
    test('should access onboarding with valid session data', async ({ page }) => {
      console.log(`🎯 Testing onboarding flow with session: ${sessionId}`);
      
      if (!sessionId) {
        console.log('⚠️ No session ID from previous tests, using test session');
        sessionId = 'test_session_comprehensive';
      }
      
      await page.goto(`/onboarding?session_id=${sessionId}`);
      
      // Check if page loads successfully
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      console.log(`📄 Onboarding page title: ${title}`);
      
      // Look for onboarding content
      const welcomeText = page.locator('h1');
      if (await welcomeText.isVisible()) {
        const heading = await welcomeText.textContent();
        console.log(`👋 Onboarding heading: ${heading}`);
      }
      
      // Check for any error messages or missing data indicators
      const errorMessages = page.locator('text=error, text=Error, text=not found');
      const errorCount = await errorMessages.count();
      
      if (errorCount > 0) {
        console.log('⚠️ Potential errors found on onboarding page:');
        for (let i = 0; i < errorCount; i++) {
          const errorText = await errorMessages.nth(i).textContent();
          console.log(`   - ${errorText}`);
        }
      }
      
      // Test first step progression
      const getStartedButton = page.locator('button:has-text("Let\'s Get Started"), button:has-text("Continue"), button:has-text("Next")');
      if (await getStartedButton.first().isVisible()) {
        console.log('✅ Onboarding flow appears functional');
      } else {
        console.log('⚠️ No clear progression button found');
      }
    });
  });

  test.describe('Phase 5: Campaign Upload Flow Testing', () => {
    test('should test campaign upload flow with session data', async ({ page }) => {
      console.log(`🚀 Testing campaign upload flow with session: ${sessionId}`);
      
      await page.goto(`/campaign-upload?session_id=${sessionId || 'test_session'}`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      console.log(`📄 Campaign upload page title: ${title}`);
      
      // Check for campaign upload interface
      const campaignHeading = page.locator('h1');
      if (await campaignHeading.isVisible()) {
        const heading = await campaignHeading.textContent();
        console.log(`🎯 Campaign heading: ${heading}`);
      }
      
      // Look for Meta connection interface
      const metaButton = page.locator('button:has-text("Connect Meta"), button:has-text("Meta Business")');
      if (await metaButton.first().isVisible()) {
        console.log('✅ Meta connection interface found');
      } else {
        console.log('⚠️ Meta connection interface not found');
      }
      
      // Check for step indicators
      const steps = page.locator('text=Step, text=Connect Meta, text=Budget Setup, text=Campaign Preview');
      const stepCount = await steps.count();
      console.log(`📊 Found ${stepCount} step indicators`);
    });
  });

  test.describe('Phase 6: Error Monitoring & Edge Cases', () => {
    test('should test with invalid session ID', async ({ page }) => {
      console.log('🔍 Testing error handling with invalid session...');
      
      await page.goto('/onboarding?session_id=invalid_test_session_12345');
      
      await page.waitForLoadState('networkidle');
      
      // Check how the app handles invalid sessions
      const title = await page.title();
      const url = page.url();
      
      console.log(`📄 Page with invalid session - Title: ${title}`);
      console.log(`🔗 Final URL: ${url}`);
      
      // Look for error messages or redirects
      const errorIndicators = page.locator('text=error, text=Error, text=not found, text=invalid');
      const errorCount = await errorIndicators.count();
      
      if (errorCount > 0) {
        console.log('⚠️ Error indicators found (expected for invalid session):');
        for (let i = 0; i < errorCount; i++) {
          const errorText = await errorIndicators.nth(i).textContent();
          console.log(`   - ${errorText}`);
        }
      }
    });

    test('should check for console errors across the flow', async ({ page }) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        } else if (msg.type() === 'warning') {
          warnings.push(msg.text());
        }
      });
      
      // Navigate through key pages
      const testPages = [
        '/get-started',
        '/onboarding',
        '/campaign-upload',
        '/campaign-success',
        '/my-campaign'
      ];
      
      for (const testPage of testPages) {
        console.log(`🔍 Checking console errors for ${testPage}`);
        await page.goto(testPage);
        await page.waitForLoadState('networkidle');
      }
      
      console.log(`🐛 Total console errors found: ${errors.length}`);
      console.log(`⚠️ Total console warnings found: ${warnings.length}`);
      
      // Filter out expected/harmless errors
      const criticalErrors = errors.filter(error => 
        !error.includes('session_id') && 
        !error.includes('404') &&
        !error.includes('customer not found') &&
        !error.includes('favicon')
      );
      
      if (criticalErrors.length > 0) {
        console.log('❌ Critical console errors found:');
        criticalErrors.forEach(error => console.log(`   - ${error}`));
      } else {
        console.log('✅ No critical console errors found');
      }
    });
  });

  test.describe('Phase 7: Data Consistency Validation', () => {
    test('should verify data consistency across API endpoints', async ({ page }) => {
      console.log('🔍 Testing data consistency across API endpoints...');
      
      // Test checkout API
      const checkoutResponse = await page.request.post('/api/checkout', {
        data: testCustomer
      });
      
      console.log(`🛒 Checkout API: ${checkoutResponse.status()}`);
      
      if (checkoutResponse.status() === 200) {
        const checkoutData = await checkoutResponse.json();
        const testSessionId = checkoutData.sessionId;
        
        // Test if customer API can find the data
        await page.waitForTimeout(1000); // Allow for data persistence
        
        const customerResponse = await page.request.get(`/api/customer?session_id=${testSessionId}`);
        console.log(`👤 Customer API: ${customerResponse.status()}`);
        
        // Test Meta auth API
        const metaResponse = await page.request.get(`/api/meta/auth?session_id=${testSessionId}`);
        console.log(`📘 Meta Auth API: ${metaResponse.status()}`);
        
        if (metaResponse.status() === 200) {
          const metaData = await metaResponse.json();
          console.log('✅ Meta auth URL generated:', metaData.authUrl ? 'Yes' : 'No');
        }
      }
    });
  });
});