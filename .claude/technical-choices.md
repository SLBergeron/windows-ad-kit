# Windows Ad Kit - Technical Architecture & Decisions

## System Overview

Windows Ad Kit is a Next.js-based SaaS platform that provides AI-powered Facebook/Instagram ad campaign generation specifically for Windows & Door contractors. The system processes business intelligence, generates strategic advertising angles, and integrates with Meta's advertising platform.

## Core Technology Stack

### Frontend Framework: Next.js 14 + TypeScript
**Decision Rationale:**
- **Server-Side Rendering**: Critical for SEO and landing page performance
- **Type Safety**: Complex business logic requires compile-time error checking  
- **Developer Experience**: Hot reloading and excellent tooling for rapid development
- **Performance**: Automatic code splitting and optimization
- **API Routes**: Unified full-stack development without separate backend

**Key Implementation Details:**
- App Router architecture for modern routing patterns
- Client-side components for interactive features (ROI calculator, progress tracking)
- Server components for data fetching and static content
- Custom styling using CSS-in-JS for component isolation

### Database: Supabase (PostgreSQL)
**Decision Rationale:**
- **PostgreSQL**: Robust relational database with JSON support for business intelligence
- **Real-time Subscriptions**: Live progress tracking during ad generation
- **Row-Level Security**: Built-in authentication and authorization
- **Edge Functions**: Serverless compute close to users
- **Cost Efficiency**: Generous free tier and predictable pricing

**Schema Design:**
```sql
-- Core business entities
customers (id, business_name, city, email, stripe_session_id, created_at)
campaigns (id, customer_id, name, type, status, business_intel, created_at)
figma_jobs (id, campaign_id, status, progress, output_urls, figma_package, created_at)

-- Business intelligence storage
business_intel: JSONB column storing:
- businessType, yearsInBusiness, uniqueAdvantage
- currentMarketing, biggestChallenge, idealCustomer  
- previousAdSpend, conversionGoal
```

**Advanced Features:**
- JSONB for flexible business intelligence storage
- GIN indexes on JSONB columns for fast queries
- Row-level security policies for customer data isolation
- Automated backups and point-in-time recovery

### Payment Processing: Stripe
**Decision Rationale:**
- **Industry Standard**: Trusted by customers, excellent documentation
- **Webhook Reliability**: Robust event system for order fulfillment
- **International Support**: Easy expansion to global markets
- **Subscription Ready**: Built-in support for upsell services
- **Security Compliance**: PCI DSS Level 1 certified

**Implementation Architecture:**
```typescript
// Checkout session creation
await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{ price: 'price_windows_ad_kit', quantity: 1 }],
  mode: 'payment',
  success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/get-started?canceled=true`,
  metadata: { businessName, city, email }
})

// Webhook processing for order fulfillment
export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')
  const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  
  if (event.type === 'checkout.session.completed') {
    // Create customer record and trigger onboarding
    await createCustomerFromSession(event.data.object)
  }
}
```

### Testing Infrastructure: Playwright
**Decision Rationale:**
- **End-to-End Coverage**: Tests complete user journeys from landing to campaign creation
- **Cross-Browser Support**: Ensures compatibility across Chrome, Firefox, Safari
- **Network Intercription**: Mock API responses for consistent testing
- **Visual Regression**: Screenshot comparison for UI stability
- **CI/CD Integration**: Automated testing on deployment

**Test Coverage:**
- Complete purchase flow with Stripe test cards
- Onboarding form validation and submission
- Ad generation progress tracking
- Meta campaign upload simulation
- Mobile responsiveness verification

## AI & Business Intelligence System

### Angle Selection Algorithm
**Decision Rationale:**
- **Deterministic Logic**: Reproducible results based on business data
- **Weighted Scoring**: Multiple factors influence angle selection
- **Extensible Framework**: Easy to add new angles and criteria
- **Performance Optimized**: Fast calculation for real-time responses

**Algorithm Implementation:**
```typescript
function generateStrategicAngles(businessIntel: any, customer: any) {
  const baseAngles = [
    {
      id: 'financing',
      priority: getFinancingPriority(businessIntel),
      messaging: generateFinancingMessage(businessIntel, customer)
    },
    // ... other angles
  ]
  
  return baseAngles
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
}

function getFinancingPriority(businessIntel: any): number {
  let score = 50 // base score
  
  if (businessIntel.avgProjectValue >= '8000') score += 30
  if (businessIntel.biggestChallenge === 'pricing_competition') score += 20
  if (businessIntel.previousAdSpend === 'none') score += 15
  
  return Math.min(score, 100)
}
```

### ROI Calculation Engine
**Decision Rationale:**
- **Industry Benchmarks**: Based on real contractor performance data
- **Multiple Variables**: Considers business type, experience, budget efficiency
- **COGS Integration**: Includes cost of goods sold for realistic profit projections
- **Real-time Updates**: Interactive budget slider with instant recalculation

**Financial Modeling:**
```typescript
const calculateROI = (dailyBudget: number, avgProjectValue: number, businessType: string, yearsInBusiness: string) => {
  // Lead cost calculation with multiple factors
  const baseCostPerLead = businessType === 'windows_only' ? 120 : 150
  const experienceMultiplier = yearsInBusiness === '10_plus' ? 0.85 : 
                              yearsInBusiness === '0_2' ? 1.4 : 1.0
  const budgetEfficiencyMultiplier = dailyBudget > 100 ? 0.9 : 
                                    dailyBudget < 50 ? 1.3 : 1.0
  
  const costPerLead = baseCostPerLead * experienceMultiplier * budgetEfficiencyMultiplier
  const leadsPerMonth = (dailyBudget * 30) / costPerLead
  
  // Close rate based on business maturity
  const baseCloseRate = businessType === 'windows_only' ? 0.22 : 0.18
  const experienceCloseBonus = yearsInBusiness === '10_plus' ? 0.05 : 
                              yearsInBusiness === '0_2' ? -0.03 : 0
  
  const closeRate = baseCloseRate + experienceCloseBonus
  const projectsPerMonth = leadsPerMonth * closeRate
  const grossSales = projectsPerMonth * avgProjectValue
  
  // COGS and profit calculation
  const cogs = grossSales * 0.50 // 50% COGS for contractors
  const netProfit = (grossSales - cogs) - (dailyBudget * 30)
  const roas = grossSales / (dailyBudget * 30)
  
  return { leadsPerMonth, projectsPerMonth, grossSales, netProfit, roas }
}
```

## Meta Integration Architecture

### API Integration Strategy
**Decision Rationale:**
- **Meta Business API**: Direct integration with Facebook's advertising platform
- **OAuth 2.0 Flow**: Secure user authorization for account access
- **Webhook Processing**: Real-time campaign status updates
- **Rate Limiting**: Respect API quotas and implement backoff strategies

**Implementation Challenges & Solutions:**

**Challenge**: Meta's complex permission system
**Solution**: Progressive permission requests with clear user consent flows

**Challenge**: API rate limiting at scale
**Solution**: Request queuing with exponential backoff and batch operations

**Challenge**: Campaign creation complexity
**Solution**: Template-based campaign structures with Advantage+ optimization

### Campaign Upload System
**Current Implementation:**
```typescript
// One-click campaign upload to Meta
const createMetaCampaign = async (campaignData) => {
  const campaign = await metaAPI.createCampaign({
    name: `${businessName} - AI Lead Generation`,
    objective: 'LEAD_GENERATION',
    status: 'PAUSED', // Safety: start paused
    special_ad_categories: ['EMPLOYMENT_AND_HOUSING'] // Compliance
  })
  
  const adSet = await metaAPI.createAdSet({
    campaign_id: campaign.id,
    name: 'AI-Optimized Homeowner Targeting',
    targeting: {
      age_min: 35, age_max: 65,
      geo_locations: { cities: [{ key: cityId, radius: 25 }] },
      income: [{ income_percentile: '25_to_100' }],
      home_ownership: ['HOMEOWNER']
    },
    optimization_goal: 'LEAD_GENERATION',
    daily_budget: campaignData.dailyBudget * 100 // Convert to cents
  })
  
  // Upload creative assets and create ads
  for (const creative of campaignData.creatives) {
    await createAdWithCreative(adSet.id, creative)
  }
}
```

## Security & Compliance

### Data Protection
**Customer Data Encryption:**
- All data encrypted in transit (TLS 1.3)
- Database encryption at rest (AES-256)
- Supabase Row-Level Security for access control
- GDPR compliance with data export/deletion capabilities

**API Security:**
- Environment variable management for sensitive keys
- Webhook signature verification for Stripe events
- Rate limiting on public endpoints
- Input validation and sanitization

### Financial Compliance
**Stripe Integration:**
- PCI DSS Level 1 compliance through Stripe
- No storage of payment card information
- Webhook idempotency for duplicate event protection
- Automated invoice generation and receipt delivery

## Performance Optimization

### Frontend Performance
**Optimization Strategies:**
- Next.js automatic code splitting
- Image optimization with next/image
- Static generation for marketing pages
- Client-side caching for dashboard data
- Lazy loading for heavy components

**Core Web Vitals Targets:**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms  
- Cumulative Layout Shift (CLS): < 0.1

### Backend Performance
**Database Optimization:**
- Indexed queries on frequently accessed columns
- Connection pooling for concurrent requests
- Query optimization for business intelligence analysis
- Read replicas for dashboard queries

**API Response Times:**
- Campaign generation: < 2 minutes (with progress updates)
- ROI calculations: < 100ms
- Customer data retrieval: < 200ms
- Meta API operations: < 5 seconds

## Development & Deployment

### Local Development Setup
```bash
# Environment setup
cp .env.example .env.local
npm install
npm run dev

# Database setup
npm run db:migrate
npm run db:seed

# Testing
npm run test           # Unit tests
npm run test:e2e      # Playwright tests
npm run test:watch    # Watch mode
```

### CI/CD Pipeline
**Deployment Strategy:**
- Vercel for frontend hosting and edge functions
- Supabase for database and real-time features
- GitHub Actions for automated testing
- Staging environment for pre-production testing

**Quality Gates:**
- TypeScript compilation without errors
- All unit tests passing
- Playwright e2e tests successful
- Performance budget compliance
- Security vulnerability scanning

### Monitoring & Observability
**Application Monitoring:**
- Vercel Analytics for performance tracking
- Supabase dashboard for database metrics
- Stripe dashboard for payment monitoring
- Custom logging for business intelligence analysis

**Error Tracking:**
- Comprehensive error boundaries in React components
- API error logging with context preservation
- User-friendly error messages with support contact
- Automated alerting for critical failures

## Scaling Considerations

### Current Architecture Limits
**Known Bottlenecks:**
- Ad generation is currently synchronous (2-10 minutes)
- Business intelligence analysis runs on-demand
- Meta API rate limits during high usage
- Single-tenant database architecture

### Scaling Solutions
**Phase 1 (0-1000 customers):**
- Current architecture sufficient
- Optimize database queries
- Implement caching layer
- Monitor performance metrics

**Phase 2 (1000-10000 customers):**
- Implement background job processing
- Database read replicas
- CDN for static assets
- Multi-region deployment

**Phase 3 (10000+ customers):**
- Microservices architecture
- Event-driven processing
- Dedicated AI processing servers
- Multi-tenant database sharding

## Future Technical Roadmap

### Immediate Priorities (Next 3 Months)
1. **Real Creative Generation**: Replace mock URLs with actual Figma/Canva API integration
2. **Enhanced Analytics**: Performance tracking dashboard with Meta API integration
3. **Mobile Optimization**: Progressive Web App features for mobile users
4. **Automated Testing**: Comprehensive test coverage for all user flows

### Medium-term Goals (3-12 Months)
1. **Multi-Platform Support**: Google Ads and TikTok integration
2. **Advanced AI Features**: Machine learning for performance prediction
3. **Agency Platform**: Multi-tenant architecture for marketing agencies
4. **API Development**: Third-party integrations and webhook system

### Long-term Vision (12+ Months)
1. **Autonomous Optimization**: Self-healing campaigns with minimal human intervention
2. **Market Intelligence**: Competitive analysis and trend detection
3. **Vertical Expansion**: Automated adaptation for new contractor types
4. **International Markets**: Multi-language and multi-currency support

## Technical Debt & Maintenance

### Current Technical Debt
1. **Mock Ad Generation**: Using placeholder URLs instead of real creative generation
2. **Hardcoded Business Logic**: Angle selection algorithm needs configuration system
3. **Limited Error Handling**: Need more granular error recovery mechanisms
4. **Test Coverage Gaps**: Some edge cases in payment and Meta integration flows

### Maintenance Strategy
**Regular Tasks:**
- Dependency updates and security patches
- Database maintenance and query optimization
- Performance monitoring and optimization
- User feedback incorporation and UI improvements

**Quarterly Reviews:**
- Architecture assessment for scaling needs
- Security audit and penetration testing
- Performance benchmarking and optimization
- Technology stack evaluation and updates