# Meta Developer App Setup Guide for Windows Ad Kit

This guide walks you through creating and configuring a Meta Developer App for the Windows Ad Kit platform to enable automatic campaign upload and analytics features.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **Business Facebook Account** (not personal)
- ✅ **Meta Business Manager** account setup
- ✅ **Valid business domain** (windowadkit.com)
- ✅ **Developer access** to the Meta platform
- ✅ **Production-ready Windows Ad Kit** platform

## 🚀 Step-by-Step Setup Process

### Phase 1: Create Meta Developer App

#### 1. Access Meta for Developers
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Log in with your Business Facebook account
3. Click **"My Apps"** in the top navigation
4. Click **"Create App"** button

#### 2. Choose App Type
Select **"Business"** as your app type:
- ✅ **Business**: For business integrations (this is what we need)
- ❌ Consumer: For consumer apps
- ❌ Gaming: For games

#### 3. Basic App Information
Fill out the app creation form:
```
App Name: Windows Ad Kit Campaign Manager
App Contact Email: your-business-email@domain.com
Business Manager Account: [Select your business manager]
```

#### 4. Create App ID
- Meta will generate an **App ID** (this becomes your `META_APP_ID`)
- Note down this ID immediately

### Phase 2: Configure App Settings

#### 1. Basic Settings
Navigate to **App Settings > Basic**:
```
App Name: Windows Ad Kit Campaign Manager
Contact Email: support@windowadkit.com
Privacy Policy URL: https://windowadkit.com/privacy
Terms of Service URL: https://windowadkit.com/terms
App Icon: Upload 1024x1024 Windows Ad Kit logo
Category: Business
```

#### 2. App Domains
Add your domains in **App Domains**:
```
windowadkit.com
www.windowadkit.com
localhost (for development only)
```

#### 3. Platform Configuration
Click **"+ Add Platform"** and select **"Website"**:
```
Site URL: https://windowadkit.com
```

### Phase 3: Add Required Products

#### 1. Facebook Login
1. In left sidebar, click **"+ Add Product"**
2. Find **"Facebook Login"** and click **"Set Up"**
3. Choose **"Web"** platform
4. Configure Valid OAuth Redirect URIs:
```
https://windowadkit.com/api/meta/callback
https://www.windowadkit.com/api/meta/callback
http://localhost:3000/api/meta/callback (development only)
```

#### 2. Marketing API
1. Click **"+ Add Product"** again
2. Find **"Marketing API"** and click **"Set Up"**
3. This enables campaign management and analytics access

### Phase 4: Configure Permissions & Features

#### 1. App Review & Permissions
Navigate to **App Review > Permissions and Features**:

**Required Permissions to Request:**
- ✅ `ads_management` - Create and manage ad campaigns
- ✅ `business_management` - Access business manager data  
- ✅ `pages_read_engagement` - Read page engagement data
- ✅ `pages_manage_ads` - Manage ads for pages
- ✅ `pages_manage_metadata` - Manage page metadata
- ✅ `leads_retrieval` - Access lead generation data

#### 2. Advanced Access Requests
For each permission above:
1. Click **"Request Advanced Access"**
2. Provide detailed explanation of usage
3. Submit verification materials (see Phase 5)

### Phase 5: Business Verification

#### 1. Business Verification Documents
Meta requires business verification. Prepare:
- ✅ **Business Registration Certificate**
- ✅ **Tax Identification Document**  
- ✅ **Business License** (if applicable)
- ✅ **Utility Bill** or **Bank Statement** (address verification)
- ✅ **Articles of Incorporation** (for corporations)

#### 2. App Use Case Documentation
Create detailed documentation explaining:

```markdown
## Windows Ad Kit - Meta Integration Use Case

### Business Purpose
Windows Ad Kit helps window contractors create and manage Facebook advertising campaigns. Our Meta integration automates campaign creation and provides performance analytics.

### Data Usage
- Customer business information (name, city, phone) for campaign targeting
- Campaign performance data for optimization recommendations
- Lead generation data for conversion tracking

### User Flow
1. Customer completes onboarding with business information
2. Customer authorizes Meta Business Manager connection
3. System automatically creates optimized ad campaigns
4. Real-time analytics and performance tracking provided

### Business Value
- Reduces campaign setup time from hours to minutes
- Provides professional-grade targeting for small businesses
- Enables data-driven optimization recommendations
```

### Phase 6: App Review Submission

#### 1. Prepare Submission Materials
Create a comprehensive submission package:

**A. Screen Recordings (Required)**
- ✅ Complete user flow from signup to campaign creation
- ✅ Meta authorization process demonstration
- ✅ Campaign management and analytics features
- ✅ Data privacy and user consent workflows

**B. Test Credentials**
Provide Meta with test account:
```
Test Business Name: Test Window Company
Test Email: test@windowadkit.com
Test Phone: (555) 123-4567
Test City: Austin, TX
```

**C. Technical Documentation**
- ✅ API integration documentation
- ✅ Data flow diagrams
- ✅ Security measures documentation
- ✅ User consent and privacy controls

#### 2. Submit for Review
1. Navigate to **App Review > Requests**
2. Click **"Add Items"** for each required permission
3. Provide detailed explanations for each permission
4. Upload all supporting materials
5. Submit for review

**Expected Review Timeline:** 3-7 business days

### Phase 7: Production Configuration

#### 1. App Secret & Tokens
Once approved, retrieve your credentials:
```bash
# In Meta App Dashboard > App Settings > Basic
META_APP_ID="your_app_id_here"
META_APP_SECRET="your_app_secret_here"

# These go in your .env.local file
```

#### 2. Webhook Configuration
Set up webhooks for real-time updates:
```
Webhook URL: https://windowadkit.com/api/webhooks/meta
Verify Token: your_secure_verify_token
```

#### 3. Switch to Live Mode
In **App Settings > Basic**:
1. Change **App Mode** from "Development" to "Live"
2. Confirm all permissions are approved
3. Test with real business accounts

## 🔒 Security & Compliance

### 1. Data Protection
- ✅ Store access tokens securely (encrypted)
- ✅ Implement token refresh mechanisms
- ✅ Log all API interactions for audit
- ✅ Follow Meta's data retention policies

### 2. Rate Limiting
Implement proper rate limiting:
```javascript
// Example rate limiting for Meta API
const rateLimiter = {
  maxRequestsPerHour: 200,
  maxConcurrentRequests: 5,
  retryAfterRateLimit: true
}
```

### 3. Error Handling
Robust error handling for:
- ✅ API rate limits
- ✅ Permission errors
- ✅ Token expiration
- ✅ Campaign creation failures

## 🧪 Testing Strategy

### 1. Development Testing
Use Meta's test environment:
```javascript
// Test App ID for development
const TEST_META_APP_ID = "your_test_app_id"
const isProduction = process.env.NODE_ENV === 'production'
const appId = isProduction ? META_APP_ID : TEST_META_APP_ID
```

### 2. Sandbox Testing
- ✅ Test all user flows in Meta's sandbox
- ✅ Verify campaign creation without real spend
- ✅ Test error scenarios and edge cases
- ✅ Validate analytics data accuracy

### 3. Production Monitoring
Implement monitoring for:
- ✅ API success/failure rates
- ✅ Token expiration tracking
- ✅ Campaign creation success rates
- ✅ User authorization completion rates

## 📊 Expected Timeline

### Phase 1-3: Initial Setup (2-3 days)
- App creation and basic configuration
- Product additions and permissions setup
- Domain verification

### Phase 4-5: Documentation & Verification (1-2 weeks)
- Business verification submission
- Use case documentation
- Screen recording creation

### Phase 6: App Review (3-7 business days)
- Meta review process
- Potential clarification requests
- Approval notification

### Phase 7: Production Launch (1-2 days)
- Environment configuration
- Live testing
- User acceptance testing

**Total Expected Timeline: 2-4 weeks**

## 🚨 Common Issues & Solutions

### 1. Business Verification Rejection
**Cause:** Insufficient documentation
**Solution:** Provide additional business documents, ensure all information matches exactly

### 2. Permission Request Denial
**Cause:** Unclear use case explanation
**Solution:** Provide more detailed technical documentation and user flow videos

### 3. Domain Verification Issues
**Cause:** DNS or SSL configuration problems
**Solution:** Verify domain ownership through Meta Business Manager first

### 4. Review Process Delays
**Cause:** High review volume or incomplete submissions
**Solution:** Ensure all materials are complete before submission, respond quickly to Meta feedback

## 📞 Support Resources

- **Meta for Developers Documentation:** [developers.facebook.com/docs](https://developers.facebook.com/docs)
- **Meta Business Help Center:** [business.facebook.com/help](https://business.facebook.com/help)
- **Marketing API Documentation:** [developers.facebook.com/docs/marketing-api](https://developers.facebook.com/docs/marketing-api)
- **App Review Guidelines:** [developers.facebook.com/docs/app-review](https://developers.facebook.com/docs/app-review)

## ✅ Post-Approval Checklist

Once your app is approved:

- [ ] Update production environment variables
- [ ] Test complete user flow with real Meta account
- [ ] Monitor initial campaign creation success rates
- [ ] Set up error monitoring and alerting
- [ ] Create user documentation for Meta connection process
- [ ] Train support team on Meta-related issues
- [ ] Plan for ongoing compliance monitoring

## 🔄 Maintenance & Updates

### Regular Tasks
- **Monthly:** Review API usage and rate limits
- **Quarterly:** Update business verification documents if needed
- **Annually:** Review and update app permissions as features evolve

### Version Updates
When updating the Meta integration:
1. Test thoroughly in development environment
2. Submit app review for new permission requests
3. Plan staged rollout for production updates
4. Monitor for any integration issues post-deployment

---

**Need Help?** Contact the development team or refer to Meta's extensive documentation and support resources.