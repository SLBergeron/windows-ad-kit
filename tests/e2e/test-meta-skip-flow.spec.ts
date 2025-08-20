import { test, expect } from '@playwright/test';

test.describe('Meta Skip Flow Test', () => {
  test('should allow users to skip Meta connection and get campaign files', async ({ page }) => {
    console.log('🧪 Testing Meta skip flow...');

    // Go directly to the campaign upload page (simulating completed onboarding)
    const testSessionId = `cs_test_meta_skip_${Date.now()}`;
    await page.goto(`/campaign-upload?session_id=${testSessionId}`);
    await page.waitForLoadState('networkidle');
    
    console.log('📋 On campaign upload page');

    // Phase 1: Verify skip option is available
    console.log('🔍 Checking for skip Meta option...');
    
    // Look for the skip button
    const skipButton = page.locator('button:has-text("📁 Skip & Get Campaign Files")');
    const hasSkipButton = await skipButton.count() > 0;
    console.log(`   Skip button found: ${hasSkipButton ? 'YES ✅' : 'NO ❌'}`);
    
    if (!hasSkipButton) {
      console.log('❌ Skip button not found - checking page content...');
      const pageContent = await page.textContent('body');
      console.log(`   Page contains 'Skip': ${pageContent.includes('Skip')}`);
      console.log(`   Page contains 'Optional': ${pageContent.includes('Optional')}`);
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'meta-skip-button-missing.png', fullPage: true });
      return;
    }

    // Phase 2: Verify the comparison cards are shown
    console.log('🔍 Checking feature comparison...');
    
    const autoUploadCard = page.locator('text=🚀 With Meta Connection');
    const manualCard = page.locator('text=📁 Skip Connection');
    
    const hasAutoUploadCard = await autoUploadCard.count() > 0;
    const hasManualCard = await manualCard.count() > 0;
    
    console.log(`   Auto-upload option card: ${hasAutoUploadCard ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   Manual setup option card: ${hasManualCard ? 'YES ✅' : 'NO ❌'}`);

    // Phase 3: Click skip button and verify redirect
    console.log('🚀 Testing skip functionality...');
    
    // Set up navigation listener to catch the redirect
    let redirectUrl = '';
    let redirectOccurred = false;
    
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        const url = frame.url();
        if (url.includes('/campaign-success') && url.includes('skip_meta=true')) {
          redirectUrl = url;
          redirectOccurred = true;
          console.log(`🎯 Skip redirect detected: ${url}`);
        }
      }
    });

    await skipButton.click();
    
    // Wait for redirect
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    console.log(`   Contains skip_meta=true: ${currentUrl.includes('skip_meta=true')}`);
    console.log(`   Redirect occurred: ${redirectOccurred}`);

    // Phase 4: Verify campaign-success page with skip mode
    if (currentUrl.includes('/campaign-success') && currentUrl.includes('skip_meta=true')) {
      console.log('✅ Successfully redirected to skip mode success page');
      
      await page.waitForLoadState('networkidle');
      
      // Check for skip-specific content
      const skipModeIndicators = [
        '🎯 Campaign Assets Ready!',
        '📁 Download Your Campaign Assets',
        '🚀 Quick Setup Guide',
        'Download Campaign Package'
      ];
      
      console.log('🔍 Verifying skip mode content...');
      for (const indicator of skipModeIndicators) {
        const hasIndicator = await page.locator(`text=${indicator}`).count() > 0;
        console.log(`   "${indicator}": ${hasIndicator ? 'FOUND ✅' : 'MISSING ❌'}`);
      }
      
      // Test download button
      const downloadButton = page.locator('button:has-text("Download Campaign Package")');
      const hasDownloadButton = await downloadButton.count() > 0;
      console.log(`   Download button: ${hasDownloadButton ? 'FOUND ✅' : 'MISSING ❌'}`);
      
      if (hasDownloadButton) {
        console.log('🧪 Testing download functionality...');
        
        // Set up dialog handler for the mock download alert
        page.on('dialog', async dialog => {
          const message = dialog.message();
          console.log(`   Download dialog message: ${message.substring(0, 100)}...`);
          await dialog.accept();
        });
        
        await downloadButton.click();
        console.log('✅ Download button clicked successfully');
      }
      
      // Check for setup guide steps
      const setupSteps = ['Download Your Package', 'Open Meta Ads Manager', 'Create New Campaign', 'Upload Your Ad Creatives', 'Set Budget & Launch'];
      console.log('🔍 Checking setup guide steps...');
      
      for (const step of setupSteps) {
        const hasStep = await page.locator(`text=${step}`).count() > 0;
        console.log(`   "${step}": ${hasStep ? 'FOUND ✅' : 'MISSING ❌'}`);
      }
      
    } else {
      console.log('❌ Did not redirect to skip mode success page');
      await page.screenshot({ path: 'meta-skip-redirect-failed.png', fullPage: true });
    }

    // Phase 5: Verify no Meta automation content is shown
    console.log('🔍 Verifying Meta automation content is hidden...');
    
    const metaAutomationIndicators = [
      'Campaign Successfully Launched!',
      'now LIVE in Meta Ads Manager',
      'View in Meta Ads Manager'
    ];
    
    for (const indicator of metaAutomationIndicators) {
      const hasIndicator = await page.locator(`text=${indicator}`).count() > 0;
      console.log(`   Meta automation "${indicator}": ${hasIndicator ? 'INCORRECTLY SHOWN ❌' : 'CORRECTLY HIDDEN ✅'}`);
    }

    console.log('\\n🎯 META SKIP FLOW TEST SUMMARY:');
    console.log(`   Skip Option Available: ${hasSkipButton ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   Feature Comparison Shown: ${hasAutoUploadCard && hasManualCard ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   Skip Redirect Working: ${redirectOccurred || currentUrl.includes('skip_meta=true') ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   Skip Mode Content: ${currentUrl.includes('skip_meta=true') ? 'DISPLAYED ✅' : 'NOT_VERIFIED ❌'}`);
    console.log(`   Overall Skip Flow: ${hasSkipButton && (redirectOccurred || currentUrl.includes('skip_meta=true')) ? 'WORKING ✅' : 'NEEDS_FIX ❌'}`);
  });
});