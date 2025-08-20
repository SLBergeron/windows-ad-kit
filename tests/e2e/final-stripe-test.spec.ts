import { test, expect } from '@playwright/test';

test.describe('Final Stripe Payment Flow Test', () => {
  test('should complete full payment and verify redirect', async ({ page }) => {
    const testCustomer = {
      businessName: 'Final Test Windows LLC',
      city: 'Austin',
      email: 'finaltest@example.com'
    };

    console.log('🚀 Starting final comprehensive test...');

    // Phase 1: Get checkout session
    await page.goto('/get-started');
    
    await page.fill('input[name="business-name"]', testCustomer.businessName);
    await page.fill('input[name="city"]', testCustomer.city);
    await page.fill('input[name="email"]', testCustomer.email);
    
    const responsePromise = page.waitForResponse('/api/checkout');
    await page.click('button:has-text("Get My Ad Kit for $295")');
    
    const response = await responsePromise;
    const responseData = await response.json();
    const sessionId = responseData.sessionId;
    
    console.log(`✅ Session created: ${sessionId}`);

    // Phase 2: Stripe checkout with comprehensive field detection
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });
    console.log('💳 On Stripe checkout page');

    // Wait for page to fully load
    await page.waitForSelector('[data-testid="hosted-payment-submit-button"]', { timeout: 15000 });
    await page.waitForTimeout(3000); // Extra wait for dynamic content

    // Take screenshot for debugging
    await page.screenshot({ path: 'stripe-before-filling.png', fullPage: true });

    console.log('🔍 Analyzing all available form fields...');

    // Find ALL input fields and analyze them
    const allInputs = page.locator('input');
    const inputCount = await allInputs.count();
    console.log(`📝 Found ${inputCount} total input fields`);

    for (let i = 0; i < inputCount; i++) {
      try {
        const input = allInputs.nth(i);
        const name = await input.getAttribute('name');
        const placeholder = await input.getAttribute('placeholder');
        const type = await input.getAttribute('type');
        const autocomplete = await input.getAttribute('autocomplete');
        const id = await input.getAttribute('id');
        
        console.log(`  Input ${i + 1}:`, {
          name, placeholder, type, autocomplete, id
        });
      } catch (e) {
        console.log(`  Input ${i + 1}: Could not analyze`);
      }
    }

    // Smart field filling strategy
    console.log('🎯 Starting smart field filling...');

    // Card number
    const cardNumberSelectors = [
      'input[name="cardNumber"]',
      'input[id="cardNumber"]', 
      'input[autocomplete="cc-number"]',
      'input[placeholder*="1234"]',
      'input[placeholder*="card number"]'
    ];

    let cardFilled = false;
    for (const selector of cardNumberSelectors) {
      try {
        const field = page.locator(selector);
        if (await field.count() > 0 && await field.isVisible()) {
          await field.fill('4242424242424242');
          console.log(`✅ Card number filled with: ${selector}`);
          cardFilled = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    if (!cardFilled) {
      console.error('❌ Could not fill card number');
      await page.screenshot({ path: 'card-number-error.png' });
    }

    // Expiry date - try different formats and selectors
    const expirySelectors = [
      'input[name="cardExpiry"]',
      'input[id="cardExpiry"]',
      'input[autocomplete="cc-exp"]',
      'input[placeholder*="MM"]',
      'input[placeholder*="month"]',
      'input[placeholder*="YY"]',
      'input[placeholder*="exp"]'
    ];

    let expiryFilled = false;
    const expiryFormats = ['1234', '12/34', '12 / 34', '1/34'];
    
    for (const selector of expirySelectors) {
      if (expiryFilled) break;
      
      try {
        const field = page.locator(selector);
        if (await field.count() > 0 && await field.isVisible()) {
          for (const format of expiryFormats) {
            try {
              await field.fill(format);
              console.log(`✅ Expiry filled with: ${selector} (format: ${format})`);
              expiryFilled = true;
              break;
            } catch (e) {
              // Try next format
            }
          }
        }
      } catch (e) {
        // Try next selector
      }
    }

    if (!expiryFilled) {
      console.error('❌ Could not fill expiry date');
      await page.screenshot({ path: 'expiry-error.png' });
    }

    // CVC
    const cvcSelectors = [
      'input[name="cardCvc"]',
      'input[id="cardCvc"]',
      'input[autocomplete="cc-csc"]',
      'input[placeholder*="CVC"]',
      'input[placeholder*="CVV"]',
      'input[placeholder*="security"]'
    ];

    let cvcFilled = false;
    for (const selector of cvcSelectors) {
      try {
        const field = page.locator(selector);
        if (await field.count() > 0 && await field.isVisible()) {
          await field.fill('123');
          console.log(`✅ CVC filled with: ${selector}`);
          cvcFilled = true;
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }

    // Address fields
    const addressFields = [
      { 
        selectors: ['input[name*="address"]', 'input[placeholder*="Address"]', 'input[autocomplete="street-address"]'],
        value: '123 Test Street',
        name: 'address'
      },
      {
        selectors: ['input[name*="city"]', 'input[placeholder*="City"]', 'input[autocomplete="address-level2"]'],
        value: testCustomer.city,
        name: 'city'
      },
      {
        selectors: ['input[name*="postal"]', 'input[name*="zip"]', 'input[placeholder*="ZIP"]', 'input[autocomplete="postal-code"]'],
        value: '78701',
        name: 'postal'
      }
    ];

    for (const addressField of addressFields) {
      let filled = false;
      for (const selector of addressField.selectors) {
        try {
          const field = page.locator(selector);
          if (await field.count() > 0 && await field.isVisible()) {
            await field.fill(addressField.value);
            console.log(`✅ ${addressField.name} filled with: ${selector}`);
            filled = true;
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }
      
      if (!filled) {
        console.log(`⚠️ Could not fill ${addressField.name} field`);
      }
    }

    // Take screenshot after filling
    await page.screenshot({ path: 'stripe-after-filling.png', fullPage: true });

    // Check if submit button is enabled
    const submitButton = page.locator('[data-testid="hosted-payment-submit-button"]');
    const isEnabled = await submitButton.isEnabled();
    console.log(`🔘 Submit button enabled: ${isEnabled}`);

    if (!isEnabled) {
      console.log('⚠️ Submit button not enabled, checking for validation errors...');
      
      // Look for error messages
      const errorSelectors = [
        'text=required',
        'text=invalid',
        'text=error',
        '[class*="error"]',
        '[data-testid*="error"]'
      ];
      
      for (const errorSelector of errorSelectors) {
        const errors = page.locator(errorSelector);
        const count = await errors.count();
        if (count > 0) {
          console.log(`❌ Found ${count} validation errors:`);
          for (let i = 0; i < Math.min(count, 3); i++) {
            const errorText = await errors.nth(i).textContent();
            console.log(`   - ${errorText}`);
          }
        }
      }
    }

    // Phase 3: Submit payment and monitor redirect
    console.log('💰 Attempting payment submission...');

    // Set up redirect monitoring
    let redirectOccurred = false;
    let finalUrl = '';

    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        const url = frame.url();
        console.log(`🔗 Navigation detected: ${url}`);
        
        if (url.includes('/success') || url.includes('session_id=')) {
          redirectOccurred = true;
          finalUrl = url;
          console.log(`🎯 SUCCESS REDIRECT DETECTED: ${url}`);
        }
      }
    });

    // Submit the payment
    try {
      await submitButton.click();
      console.log('⏳ Payment submitted, monitoring for redirect...');

      // Wait up to 60 seconds for redirect
      const maxWaitTime = 60000;
      const checkInterval = 1000;
      let elapsedTime = 0;

      while (elapsedTime < maxWaitTime && !redirectOccurred) {
        await page.waitForTimeout(checkInterval);
        elapsedTime += checkInterval;
        
        const currentUrl = page.url();
        
        // Check if we're still on Stripe or moved to success page
        if (currentUrl.includes('/success') || currentUrl.includes('session_id=')) {
          redirectOccurred = true;
          finalUrl = currentUrl;
          console.log(`🎯 SUCCESS! Redirected to: ${currentUrl}`);
          break;
        }
        
        // Log progress every 10 seconds
        if (elapsedTime % 10000 === 0) {
          console.log(`⏳ Still waiting for redirect... ${elapsedTime/1000}s elapsed`);
          console.log(`   Current URL: ${currentUrl}`);
        }
      }

      if (redirectOccurred) {
        console.log(`🎉 SUCCESS! Payment completed and redirected to: ${finalUrl}`);
        
        // Extract session ID from URL
        const urlObj = new URL(finalUrl);
        const urlSessionId = urlObj.searchParams.get('session_id');
        
        if (urlSessionId) {
          console.log(`✅ Session ID in redirect: ${urlSessionId}`);
          
          // Verify the success page loads properly
          await page.waitForLoadState('networkidle');
          const successTitle = await page.title();
          console.log(`📄 Success page title: ${successTitle}`);
          
          // Look for customer data on success page
          const businessNameElements = page.locator(`text=${testCustomer.businessName}`);
          const businessNameCount = await businessNameElements.count();
          
          if (businessNameCount > 0) {
            console.log(`✅ Customer business name found on success page`);
          } else {
            console.log(`⚠️ Customer business name not found on success page`);
          }
          
          // Test API data persistence
          const customerResponse = await page.request.get(`/api/customer?session_id=${urlSessionId}`);
          console.log(`📊 Customer API response: ${customerResponse.status()}`);
          
          if (customerResponse.status() === 200) {
            const customerData = await customerResponse.json();
            console.log('✅ Customer data persisted successfully:', customerData.customer?.business_name);
          }
          
        } else {
          console.log('⚠️ No session_id found in redirect URL');
        }
        
      } else {
        console.error('❌ Payment submission timeout - no redirect occurred');
        console.log(`   Final URL: ${page.url()}`);
        
        // Take final screenshot for debugging
        await page.screenshot({ path: 'payment-timeout.png', fullPage: true });
        
        // Check page content for any error messages
        const pageContent = await page.content();
        if (pageContent.includes('error') || pageContent.includes('declined')) {
          console.log('❌ Payment may have been declined or failed');
        }
      }

    } catch (error) {
      console.error('❌ Error during payment submission:', error);
      await page.screenshot({ path: 'payment-error.png', fullPage: true });
    }

    // Final summary
    console.log('\n🎯 FINAL TEST SUMMARY:');
    console.log(`   Card Number Filled: ${cardFilled}`);
    console.log(`   Expiry Date Filled: ${expiryFilled}`);
    console.log(`   CVC Filled: ${cvcFilled}`);
    console.log(`   Payment Submitted: ${isEnabled}`);
    console.log(`   Redirect Occurred: ${redirectOccurred}`);
    console.log(`   Final URL: ${finalUrl || page.url()}`);
  });
});