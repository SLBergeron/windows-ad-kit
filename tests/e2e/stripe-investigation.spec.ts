import { test, expect } from '@playwright/test';

test.describe('Stripe Checkout Investigation', () => {
  test('should investigate Stripe checkout iframe structure', async ({ page }) => {
    // First create a checkout session
    const testCustomer = {
      businessName: 'Test Investigation LLC',
      city: 'Austin', 
      email: 'test+investigation@example.com'
    };

    console.log('🔍 Creating checkout session for investigation...');
    
    const response = await page.request.post('/api/checkout', {
      data: testCustomer
    });
    
    const data = await response.json();
    const checkoutUrl = data.checkoutUrl;
    
    console.log('🔗 Checkout URL:', checkoutUrl);
    
    // Navigate to Stripe checkout
    await page.goto(checkoutUrl);
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    console.log('📄 Page title:', await page.title());
    console.log('🔗 Current URL:', page.url());
    
    // Take a screenshot for debugging
    await page.screenshot({ 
      path: 'stripe-checkout-investigation.png',
      fullPage: true 
    });
    
    console.log('📸 Screenshot saved as stripe-checkout-investigation.png');
    
    // Investigate iframe structure
    const iframes = page.locator('iframe');
    const iframeCount = await iframes.count();
    
    console.log(`🖼️ Found ${iframeCount} iframes on the page`);
    
    for (let i = 0; i < iframeCount; i++) {
      const iframe = iframes.nth(i);
      const iframeName = await iframe.getAttribute('name');
      const iframeSrc = await iframe.getAttribute('src');
      const iframeTitle = await iframe.getAttribute('title');
      
      console.log(`  Iframe ${i + 1}:`);
      console.log(`    Name: ${iframeName}`);
      console.log(`    Src: ${iframeSrc}`);
      console.log(`    Title: ${iframeTitle}`);
    }
    
    // Look for specific payment elements
    const paymentElements = [
      '[data-testid="hosted-payment-submit-button"]',
      'button:has-text("Pay")',
      'button:has-text("Complete")',
      'input[placeholder*="card"]',
      'input[placeholder*="Card"]',
      '[data-testid*="card"]',
      '[name*="card"]',
      '[id*="card"]'
    ];
    
    console.log('🔍 Looking for payment elements...');
    
    for (const selector of paymentElements) {
      const element = page.locator(selector);
      const count = await element.count();
      
      if (count > 0) {
        console.log(`  ✅ Found ${count} elements matching: ${selector}`);
        
        // Try to get more details about the first match
        try {
          const firstElement = element.first();
          const tagName = await firstElement.evaluate(el => el.tagName);
          const attributes = await firstElement.evaluate(el => {
            const attrs: Record<string, string> = {};
            for (let attr of el.attributes) {
              attrs[attr.name] = attr.value;
            }
            return attrs;
          });
          
          console.log(`    Tag: ${tagName}`);
          console.log(`    Attributes:`, attributes);
        } catch (e) {
          console.log(`    Error getting details: ${e}`);
        }
      } else {
        console.log(`  ❌ No elements found for: ${selector}`);
      }
    }
    
    // Check if we can find any input fields in iframes
    console.log('🔍 Investigating iframe contents...');
    
    for (let i = 0; i < Math.min(iframeCount, 3); i++) {
      try {
        const iframe = iframes.nth(i);
        const iframeName = await iframe.getAttribute('name');
        
        console.log(`  🖼️ Checking iframe ${i + 1} (${iframeName})...`);
        
        const frameLocator = page.frameLocator(`iframe >> nth=${i}`);
        
        // Look for common input field patterns
        const inputSelectors = [
          'input[name="cardnumber"]',
          'input[name="card-number"]', 
          'input[name="exp-date"]',
          'input[name="cvc"]',
          'input[placeholder*="card"]',
          'input[placeholder*="Card"]',
          'input[type="text"]',
          'input'
        ];
        
        for (const inputSelector of inputSelectors) {
          try {
            const inputs = frameLocator.locator(inputSelector);
            const inputCount = await inputs.count();
            
            if (inputCount > 0) {
              console.log(`    ✅ Found ${inputCount} inputs matching: ${inputSelector}`);
            }
          } catch (e) {
            // Silent fail for iframe access issues
          }
        }
        
      } catch (e) {
        console.log(`    ❌ Error accessing iframe ${i + 1}: ${e}`);
      }
    }
    
    // Wait a bit more to see if anything loads dynamically
    console.log('⏳ Waiting for dynamic content...');
    await page.waitForTimeout(5000);
    
    // Check again for the submit button specifically
    const submitButton = page.locator('[data-testid="hosted-payment-submit-button"]');
    const submitButtonExists = await submitButton.count() > 0;
    
    console.log(`🔘 Submit button exists: ${submitButtonExists}`);
    
    if (submitButtonExists) {
      const isVisible = await submitButton.isVisible();
      const isEnabled = await submitButton.isEnabled();
      
      console.log(`   Visible: ${isVisible}`);
      console.log(`   Enabled: ${isEnabled}`);
    }
    
    // Get the full page HTML for debugging
    const pageContent = await page.content();
    console.log(`📝 Page content length: ${pageContent.length} characters`);
    
    // Look for any error messages
    const errorSelectors = [
      'text=error',
      'text=Error', 
      '[data-testid*="error"]',
      '.error',
      '[class*="error"]'
    ];
    
    for (const errorSelector of errorSelectors) {
      const errors = page.locator(errorSelector);
      const errorCount = await errors.count();
      
      if (errorCount > 0) {
        console.log(`⚠️ Found ${errorCount} potential errors matching: ${errorSelector}`);
        
        for (let i = 0; i < Math.min(errorCount, 3); i++) {
          try {
            const errorText = await errors.nth(i).textContent();
            console.log(`   Error ${i + 1}: ${errorText}`);
          } catch (e) {
            console.log(`   Error ${i + 1}: Could not read text`);
          }
        }
      }
    }
  });
});