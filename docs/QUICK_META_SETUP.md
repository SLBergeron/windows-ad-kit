# Quick Meta App Configuration Guide

## 🚀 Once Your Meta App is Approved

After completing the full Meta Developer App setup process (see `META_DEVELOPER_APP_SETUP.md`), follow these steps to configure your Windows Ad Kit platform:

### 1. Update Environment Variables

Add these to your `.env.local` file:

```bash
# Meta Business Integration
META_APP_ID="your_actual_app_id_here"
META_APP_SECRET="your_actual_app_secret_here"

# Optional: Meta Access Token (if using server-to-server)
META_ACCESS_TOKEN="your_long_lived_access_token"
```

### 2. Test the Integration

1. **Start your development server:**
```bash
npm run dev
```

2. **Go through the complete user flow:**
   - Complete onboarding with a test business
   - Reach the Meta connection step
   - Click "Connect Meta Business Manager"
   - Authorize with a real Meta Business account
   - Verify campaign upload works

### 3. Production Checklist

Before going live with Meta integration:

- [ ] App is in "Live" mode (not Development)
- [ ] All required permissions are approved
- [ ] Business verification is complete
- [ ] Production domain is configured
- [ ] SSL certificate is valid
- [ ] Error monitoring is set up
- [ ] Rate limiting is implemented

### 4. Monitor Initial Launch

Key metrics to watch:
- **Authorization success rate** (should be >90%)
- **Campaign creation success rate** (should be >95%)
- **API error rates** (should be <1%)
- **User completion rate** (Meta vs Skip)

### 5. Support Preparation

Common user issues and solutions:
- **"Permission denied"** → Check app permissions in Meta
- **"Invalid redirect URI"** → Verify callback URL configuration
- **"Business not found"** → User needs Meta Business Manager account
- **"Campaign creation failed"** → Check API rate limits and account status

---

**🎯 Goal:** Once configured, >80% of users should choose Meta connection over skip option due to the improved UX and clear time/benefit advantages.