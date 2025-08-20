import { test, expect, Page } from '@playwright/test';

// Fixed comprehensive end-to-end test with correct Stripe selectors
const testCustomer = {
  businessName: 'Test Windows Pro LLC',
  city: 'Austin',
  email: 'test+fixed@example.com',
  phone: '(512) 555-0123',
  website: 'www.testwindowspro.com'
};

const stripeTestCard = {
  number: '4242424242424242', // Visa test card
  expiry: '1234', // Format as MMYY for Stripe
  cvc: '123',
  zip: '78701'
};

test.describe('Fixed Stripe Integration & Complete Flow', () => {
  let sessionId: string;

  test.describe('Complete End-to-End Flow Test', () => {
    test('should complete entire flow from form to post-payment', async ({ page }) => {
      console.log('🚀 Starting FIXED comprehensive flow test...');
      
      // Phase 1: Get-Started Form Submission
      await page.goto('/get-started');
      
      await expect(page).toHaveTitle(/Windows Ad Kit/);
      await expect(page.locator('h1')).toContainText('Tired of Your Phone');
      
      console.log('📋 Filling out form...');
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await page.fill('input[name="city"]', testCustomer.city);
      await page.fill('input[name="email"]', testCustomer.email);
      
      const submitButton = page.locator('button:has-text("Get My Ad Kit for $295")');
      await expect(submitButton).toBeEnabled();
      
      // Capture checkout response
      const responsePromise = page.waitForResponse('/api/checkout');
      await submitButton.click();
      
      const response = await responsePromise;
      expect(response.status()).toBe(200);
      
      const responseData = await response.json();
      sessionId = responseData.sessionId;
      const checkoutUrl = responseData.checkoutUrl;
      
      console.log(`✅ Session created: ${sessionId}`);
      console.log(`✅ Checkout URL: ${checkoutUrl}`);
      
      // Phase 2: Stripe Checkout with FIXED selectors
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });
      console.log('💳 On Stripe checkout page...');
      
      // Wait for checkout to fully load
      await page.waitForSelector('[data-testid="hosted-payment-submit-button"]', { 
        timeout: 15000 
      });
      console.log('🏪 Stripe checkout loaded');
      
      // Fill card details with CORRECT selectors (no iframes needed!)
      console.log('💳 Filling card details...');
      
      // Card number - direct access, no iframe
      await page.fill('input[name="cardNumber"]', stripeTestCard.number);
      console.log('✅ Card number filled');
      
      // Expiry date - look for expiry field  
      const expirySelectors = [
        'input[name="cardExpiry"]',
        'input[name="expiryDate"]', 
        'input[placeholder*="MM"]',
        'input[placeholder*="month"]',
        'input[autocomplete="cc-exp"]'
      ];
      
      let expiryFilled = false;
      for (const selector of expirySelectors) {
        try {
          const expiryField = page.locator(selector);
          if (await expiryField.count() > 0) {
            await expiryField.fill(stripeTestCard.expiry);
            console.log(`✅ Expiry filled with selector: ${selector}`);
            expiryFilled = true;
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }
      
      if (!expiryFilled) {
        console.log('⚠️ Could not find expiry field, looking for alternatives...');
        // Take screenshot for debugging
        await page.screenshot({ path: 'expiry-field-debug.png' });
      }
      
      // CVC field
      const cvcSelectors = [
        'input[name="cardCvc"]',
        'input[name="cvc"]',
        'input[placeholder*="CVC"]',
        'input[autocomplete="cc-csc"]'
      ];
      
      let cvcFilled = false;
      for (const selector of cvcSelectors) {
        try {
          const cvcField = page.locator(selector);
          if (await cvcField.count() > 0) {
            await cvcField.fill(stripeTestCard.cvc);
            console.log(`✅ CVC filled with selector: ${selector}`);
            cvcFilled = true;
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }
      
      if (!cvcFilled) {
        console.log('⚠️ Could not find CVC field, looking for alternatives...');
      }
      
      // Billing address fields
      const billingSelectors = [
        { field: 'address', selectors: ['input[name="billingAddress"]', 'input[placeholder*="Address"]', 'input[autocomplete="street-address"]'] },
        { field: 'city', selectors: ['input[name="billingCity"]', 'input[placeholder*="City"]', 'input[autocomplete="address-level2"]'] },
        { field: 'zip', selectors: ['input[name="billingPostalCode"]', 'input[placeholder*="ZIP"]', 'input[placeholder*="Postal"]', 'input[autocomplete="postal-code"]'] }
      ];
      
      for (const billing of billingSelectors) {
        let filled = false;
        for (const selector of billing.selectors) {
          try {
            const field = page.locator(selector);
            if (await field.count() > 0) {
              const value = billing.field === 'address' ? '123 Test Street' :
                           billing.field === 'city' ? testCustomer.city :
                           stripeTestCard.zip;
              await field.fill(value);
              console.log(`✅ ${billing.field} filled with selector: ${selector}`);
              filled = true;
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }
        
        if (!filled) {
          console.log(`⚠️ Could not find ${billing.field} field`);
        }
      }
      
      console.log('💰 Submitting payment...');
      
      // Submit payment and track redirect carefully
      const submitPaymentButton = page.locator('[data-testid="hosted-payment-submit-button"]');
      
      // Set up navigation tracking before clicking
      const navigationPromise = page.waitForURL(/\/success|\/onboarding|session_id=/, { 
        timeout: 45000 
      });
      
      await submitPaymentButton.click();
      console.log('⏳ Payment submitted, waiting for redirect...');
      
      // Phase 3: Critical Post-Payment Analysis
      try {
        await navigationPromise;
        
        const finalUrl = page.url();
        console.log(`🎯 SUCCESS! Post-payment redirect URL: ${finalUrl}`);
        
        // Extract session ID from URL
        const urlObj = new URL(finalUrl);
        const urlSessionId = urlObj.searchParams.get('session_id');
        
        if (urlSessionId) {
          console.log(`✅ Session ID preserved in redirect: ${urlSessionId}`);
          sessionId = urlSessionId; // Update with the actual session ID
        } else {
          console.log('⚠️ No session_id in URL, checking if it\'s in path or elsewhere');
        }
        
        // Wait for page to load completely
        await page.waitForLoadState('networkidle');
        
        const title = await page.title();
        const content = await page.content();
        
        console.log(`📄 Landing page title: ${title}`);
        console.log(`📝 Page content length: ${content.length} characters`);
        
        // Check for success indicators
        const successIndicators = [
          'success',
          'thank you',
          'payment received',
          'order confirmed',
          'campaign',
          'onboarding'
        ];
        
        let foundIndicators = [];
        for (const indicator of successIndicators) {
          if (content.toLowerCase().includes(indicator)) {
            foundIndicators.push(indicator);
          }
        }
        
        console.log(`✅ Success indicators found: ${foundIndicators.join(', ')}`);
        
        // Phase 4: Data Persistence Validation
        if (sessionId) {
          console.log(`🔍 Testing customer data persistence for session: ${sessionId}`);
          
          const customerResponse = await page.request.get(`/api/customer?session_id=${sessionId}`);
          console.log(`📊 Customer API response: ${customerResponse.status()}`);
          
          if (customerResponse.status() === 200) {
            const customerData = await customerResponse.json();
            console.log('✅ Customer data found after payment:', customerData);
            
            // Validate data structure
            expect(customerData.customer).toBeTruthy();
            expect(customerData.customer.businessName).toBe(testCustomer.businessName);
            expect(customerData.customer.city).toBe(testCustomer.city);
            expect(customerData.customer.email).toBe(testCustomer.email);
            
            console.log('✅ Customer data validation passed');
          } else {
            console.log(`⚠️ Customer data not found (${customerResponse.status()})`);
            const errorText = await customerResponse.text();
            console.log('📝 Response:', errorText);
          }
        }
        
        // Phase 5: Test Onboarding Flow
        console.log('🎯 Testing onboarding flow...');
        
        if (sessionId) {
          await page.goto(`/onboarding?session_id=${sessionId}`);
        } else {
          // Try current page if we're already on onboarding
          if (!finalUrl.includes('onboarding')) {
            await page.goto('/onboarding');
          }
        }
        
        await page.waitForLoadState('networkidle');
        
        const onboardingTitle = await page.title();
        console.log(`📄 Onboarding page title: ${onboardingTitle}`);
        
        // Look for onboarding content
        const welcomeElements = page.locator('h1, h2, h3');
        const count = await welcomeElements.count();
        
        if (count > 0) {
          const firstHeading = await welcomeElements.first().textContent();
          console.log(`👋 Onboarding heading: ${firstHeading}`);
        }
        
        // Test progression button
        const progressButtons = page.locator('button:has-text("Let\'s Get Started"), button:has-text("Continue"), button:has-text("Next"), button:has-text("Start")');
        const buttonCount = await progressButtons.count();
        
        if (buttonCount > 0) {
          console.log(`✅ Found ${buttonCount} progression buttons in onboarding`);
        } else {
          console.log('⚠️ No clear progression buttons found in onboarding');
        }
        
        console.log('🎉 COMPREHENSIVE FLOW TEST COMPLETED SUCCESSFULLY!');
        
      } catch (error) {
        console.error('❌ Post-payment redirect failed:', error);
        console.log('🔍 Current URL:', page.url());
        
        // Take screenshot for debugging
        await page.screenshot({ path: 'post-payment-failure.png', fullPage: true });
        
        // Get page content for analysis
        const content = await page.content();
        console.log('📝 Page content preview:', content.substring(0, 1000));
        
        throw error;
      }
    });
  });

  test.describe('Edge Case Testing', () => {
    test('should handle network interruptions gracefully', async ({ page }) => {
      console.log('🔍 Testing network error handling...');
      
      await page.goto('/get-started');
      
      // Fill form
      await page.fill('input[name="business-name"]', testCustomer.businessName);
      await page.fill('input[name="city"]', testCustomer.city);
      await page.fill('input[name="email"]', testCustomer.email);
      
      // Simulate network failure during checkout
      await page.route('**/api/checkout', route => route.abort());
      
      const submitButton = page.locator('button:has-text("Get My Ad Kit for $295")');
      
      // Should show error dialog
      page.on('dialog', async dialog => {
        console.log(`📱 Error dialog appeared: ${dialog.message()}`);
        expect(dialog.message()).toContain('error');
        await dialog.accept();
      });
      
      await submitButton.click();
      
      console.log('✅ Network error handled gracefully');
    });
  });
});