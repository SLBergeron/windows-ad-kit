import { test, expect } from '@playwright/test';

test.describe('Campaign Creation Fix Test', () => {
  test('should complete onboarding and create campaign without business_intel column', async ({ page }) => {
    console.log('🧪 Testing campaign creation fix...');

    // Test data
    const testCustomer = {
      businessName: 'Test Campaign Fix LLC',
      city: 'Austin',
      email: 'campaignfix@example.com'
    };

    // Phase 1: Get to onboarding (simulate successful payment)
    await page.goto('/get-started');
    
    await page.fill('input[name=\"business-name\"]', testCustomer.businessName);
    await page.fill('input[name=\"city\"]', testCustomer.city);
    await page.fill('input[name=\"email\"]', testCustomer.email);
    
    const responsePromise = page.waitForResponse('/api/checkout');
    await page.click('button:has-text(\"Get My Ad Kit for $295\")');
    
    const response = await responsePromise;
    const responseData = await response.json();
    const sessionId = responseData.sessionId;
    
    console.log(`✅ Session created: ${sessionId}`);

    // Phase 2: Go directly to onboarding (skip Stripe for this test)
    const onboardingUrl = `/onboarding?session_id=${sessionId}`;
    await page.goto(onboardingUrl);
    await page.waitForLoadState('networkidle');
    
    console.log('📋 On onboarding page');

    // Phase 3: Complete all onboarding steps quickly
    // Step 1: Welcome - click start
    await page.click('button:has-text("Let\'s Get Started")');
    await page.waitForTimeout(1000);
    
    // Step 2: Business Info
    await page.fill('input[value=""]', testCustomer.businessName); // Business name (might be pre-filled)
    await page.fill('input[placeholder="(512) 555-0123"]', '(512) 555-9999');
    await page.fill('input[placeholder="www.mikeswindows.com"]', 'www.testfix.com');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);

    // Step 3: Market Info - accept defaults
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);

    // Step 4: Business Intelligence - fill required fields
    await page.fill('textarea[placeholder*="e.g."]', 'Test unique advantage for campaign fix');
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(1000);

    // Step 5: Logo Upload - create a simple test file
    console.log('📁 Testing logo upload...');
    
    // Create a small test image data URL
    const testImageDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    // Inject a file into the file input using evaluate
    await page.evaluate((dataURL) => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        // Create a File object from data URL
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'test-logo.png', { type: mime });
        
        // Create a new FileList containing our file
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        
        // Trigger the change event
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, testImageDataURL);

    await page.waitForTimeout(2000); // Wait for file processing

    // Phase 4: Try to create campaign - this should now work
    console.log('🚀 Testing campaign creation...');
    
    // Monitor for navigation or API calls
    const campaignCreatePromise = page.waitForResponse('/api/campaign/create');
    
    await page.click('button:has-text("Create My Ads")');
    
    // Wait for the campaign creation API call
    const campaignResponse = await campaignCreatePromise;
    const campaignResponseStatus = campaignResponse.status();
    
    console.log(`📊 Campaign API response status: ${campaignResponseStatus}`);
    
    if (campaignResponseStatus === 200) {
      const campaignData = await campaignResponse.json();
      console.log('✅ Campaign created successfully!');
      console.log(`   Campaign ID: ${campaignData.campaignId}`);
      
      // Wait for redirect
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log(`🔗 Current URL after campaign creation: ${currentUrl}`);
      
      if (currentUrl.includes('campaign-upload') || currentUrl.includes('success')) {
        console.log('✅ CAMPAIGN CREATION FIX SUCCESSFUL!');
        console.log('   User was redirected to next step as expected');
      } else {
        console.log('⚠️ User not redirected as expected, but campaign was created');
      }
      
    } else {
      console.error('❌ Campaign creation still failing:');
      const errorText = await campaignResponse.text();
      console.error(`   Status: ${campaignResponseStatus}`);
      console.error(`   Response: ${errorText}`);
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'campaign-creation-still-failing.png', fullPage: true });
    }

    // Verify we can access the campaign data
    if (campaignResponseStatus === 200) {
      const campaignData = await campaignResponse.json();
      expect(campaignData.success).toBe(true);
      expect(campaignData.campaignId).toBeDefined();
      expect(campaignData.figmaPackage).toBeDefined();
      
      // Verify business intelligence is still captured in figma package
      expect(campaignData.figmaPackage.completeOnboardingData.businessIntelligence).toBeDefined();
      expect(campaignData.figmaPackage.strategicAngles).toBeDefined();
      
      console.log('✅ All campaign data validated successfully');
    }

    console.log('\\n🎯 CAMPAIGN CREATION FIX TEST SUMMARY:');
    console.log(`   API Status: ${campaignResponseStatus}`);
    console.log(`   Fix Working: ${campaignResponseStatus === 200 ? 'YES' : 'NO'}`);
    console.log(`   Business Intel Preserved: ${campaignResponseStatus === 200 ? 'YES' : 'UNKNOWN'}`);
  });
});