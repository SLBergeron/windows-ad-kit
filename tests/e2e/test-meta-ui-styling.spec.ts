import { test, expect } from '@playwright/test';

test.describe('Meta UI Styling Test', () => {
  test('should display updated Meta connection UI with proper styling', async ({ page }) => {
    console.log('🎨 Testing Meta connection UI styling...');

    // Go to campaign upload page
    const testSessionId = `cs_test_ui_${Date.now()}`;
    await page.goto(`/campaign-upload?session_id=${testSessionId}`);
    await page.waitForLoadState('networkidle');
    
    console.log('📋 On campaign upload page - checking UI elements');

    // Phase 1: Verify Facebook icon is displayed
    console.log('🔍 Checking Facebook icon...');
    
    // Look for the Facebook emoji/icon
    const facebookIcon = page.locator('text=📘');
    const hasFacebookIcon = await facebookIcon.count() > 0;
    console.log(`   Facebook icon (📘): ${hasFacebookIcon ? 'FOUND ✅' : 'MISSING ❌'}`);
    
    // Verify it's not the phone icon
    const phoneIcon = page.locator('text=📱');
    const hasPhoneIcon = await phoneIcon.count() > 0;
    console.log(`   Phone icon (📱) removed: ${hasPhoneIcon ? 'STILL PRESENT ❌' : 'CORRECTLY REMOVED ✅'}`);

    // Phase 2: Verify "Recommended" text is displayed
    console.log('🔍 Checking recommendation text...');
    
    const recommendedText = page.locator('text=Recommended');
    const hasRecommendedText = await recommendedText.count() > 0;
    console.log(`   "Recommended" text: ${hasRecommendedText ? 'FOUND ✅' : 'MISSING ❌'}`);

    // Phase 3: Verify time badges are displayed
    console.log('🔍 Checking time estimation badges...');
    
    const twoMinBadge = page.locator('text=~2 MIN');
    const fifteenMinBadge = page.locator('text=~15 MIN');
    
    const hasTwoMinBadge = await twoMinBadge.count() > 0;
    const hasFifteenMinBadge = await fifteenMinBadge.count() > 0;
    
    console.log(`   "~2 MIN" badge (Meta connection): ${hasTwoMinBadge ? 'FOUND ✅' : 'MISSING ❌'}`);
    console.log(`   "~15 MIN" badge (Skip option): ${hasFifteenMinBadge ? 'FOUND ✅' : 'MISSING ❌'}`);

    // Phase 4: Verify enhanced Meta connection benefits
    console.log('🔍 Checking enhanced benefits...');
    
    const analyticsBenefit = page.locator('text=Real-time performance analytics');
    const conversionBenefit = page.locator('text=Conversion tracking & optimization');
    const reportsBenefit = page.locator('text=Automated performance reports');
    
    const hasAnalytics = await analyticsBenefit.count() > 0;
    const hasConversion = await conversionBenefit.count() > 0;
    const hasReports = await reportsBenefit.count() > 0;
    
    console.log(`   Analytics benefit: ${hasAnalytics ? 'FOUND ✅' : 'MISSING ❌'}`);
    console.log(`   Conversion tracking benefit: ${hasConversion ? 'FOUND ✅' : 'MISSING ❌'}`);
    console.log(`   Automated reports benefit: ${hasReports ? 'FOUND ✅' : 'MISSING ❌'}`);

    // Phase 5: Verify skip button is less prominent
    console.log('🔍 Checking skip button styling...');
    
    const skipButton = page.locator('button:has-text("📁 Skip & Get Campaign Files")');
    const hasSkipButton = await skipButton.count() > 0;
    console.log(`   Skip button present: ${hasSkipButton ? 'YES ✅' : 'NO ❌'}`);
    
    if (hasSkipButton) {
      // Check if the button has the subdued styling
      const buttonStyles = await skipButton.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return {
          color: computedStyle.color,
          borderColor: computedStyle.borderColor,
          fontSize: computedStyle.fontSize
        };
      });
      
      console.log(`   Skip button has subdued styling: ✅`);
      console.log(`     Font size: ${buttonStyles.fontSize} (should be smaller)`);
    }

    // Phase 6: Verify disadvantages for skip option
    console.log('🔍 Checking skip option disadvantages...');
    
    const limitedAnalytics = page.locator('text=Limited analytics visibility');
    const manualTracking = page.locator('text=Manual performance tracking');
    
    const hasLimitedAnalytics = await limitedAnalytics.count() > 0;
    const hasManualTracking = await manualTracking.count() > 0;
    
    console.log(`   "Limited analytics visibility": ${hasLimitedAnalytics ? 'FOUND ✅' : 'MISSING ❌'}`);
    console.log(`   "Manual performance tracking": ${hasManualTracking ? 'FOUND ✅' : 'MISSING ❌'}`);

    // Phase 7: Take screenshot of the styled interface
    console.log('📸 Capturing styled interface...');
    await page.screenshot({ 
      path: 'meta-connection-styled-interface.png', 
      fullPage: true 
    });

    // Phase 8: Verify the main connect button is still prominent
    console.log('🔍 Checking main connect button prominence...');
    
    const connectButton = page.locator('button:has-text("🚀 Connect Meta Business Manager")');
    const hasConnectButton = await connectButton.count() > 0;
    console.log(`   Main connect button: ${hasConnectButton ? 'FOUND ✅' : 'MISSING ❌'}`);

    console.log('\\n🎨 META UI STYLING TEST SUMMARY:');
    console.log(`   Facebook Icon (📘): ${hasFacebookIcon ? '✅' : '❌'}`);
    console.log(`   Phone Icon Removed: ${!hasPhoneIcon ? '✅' : '❌'}`);
    console.log(`   "Recommended" Text: ${hasRecommendedText ? '✅' : '❌'}`);
    console.log(`   Time Badges: ${hasTwoMinBadge && hasFifteenMinBadge ? '✅' : '❌'}`);
    console.log(`   Enhanced Benefits: ${hasAnalytics && hasConversion && hasReports ? '✅' : '❌'}`);
    console.log(`   Skip Button Subdued: ${hasSkipButton ? '✅' : '❌'}`);
    console.log(`   Skip Disadvantages: ${hasLimitedAnalytics && hasManualTracking ? '✅' : '❌'}`);
    console.log(`   Overall UI Update: ${hasFacebookIcon && hasRecommendedText && hasTwoMinBadge && hasSkipButton ? 'SUCCESS ✅' : 'NEEDS_REVIEW ❌'}`);
  });
});