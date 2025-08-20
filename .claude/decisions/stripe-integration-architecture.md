# Stripe Integration & Customer Portal Architecture

**Date**: 2025-08-19
**Context**: Phase 2 implementation - Complete Stripe payment flow and customer portal

## Key Decisions Made

### 1. Stripe Integration Architecture

#### Payment Flow Design
- **Product Configuration**: Single product "Windows Ad Kit" at $295 one-time payment
- **Session Creation**: `/api/checkout` endpoint creates Stripe checkout sessions
- **Webhook Handler**: `/api/webhooks/stripe` processes completed payments
- **Business Data Collection**: Captures business name and city in checkout metadata

#### Business-Friendly Naming Convention
Following project conventions for clear, non-technical naming:
- `handleKitPurchase()` instead of `handleCheckoutCompleted()`
- `createCustomerAccount()` instead of `provisionUser()`
- `/api/webhooks/stripe` instead of `/api/stripe-webhook`
- Clear variable names: `businessName`, `customerEmail`, `sessionId`

### 2. Database Schema Design

#### Core Tables
- **customers**: Business name, city, email, Stripe IDs, addresses, status
- **campaigns**: Name, type, status, budget, performance metrics
- **appointments**: Lead details, scheduling, status, revenue tracking

#### Data Relationships
- One customer has many campaigns
- One campaign has many appointments
- Row Level Security (RLS) ensures customers only see their own data

#### Business-Friendly Field Names
- `business_name` not `company_name` or `organization`
- `appointments_booked` not `conversions`
- `cost_per_appointment` not `cpa` or `cost_per_conversion`
- `revenue_generated` not `total_value` or `sales`

### 3. Customer Portal Architecture

#### Page Structure
- **/my-appointments**: Primary dashboard showing key metrics and upcoming appointments
- **/my-campaigns**: Detailed campaign management (already existed)
- **/success**: Post-purchase confirmation and next steps

#### Dashboard Design Principles
- **Immediate Value Display**: Show preparation status and timeline
- **Clear Progress Tracking**: Visual steps for what's happening next
- **Sample Data Preview**: Help contractors visualize future appointments
- **Business-Friendly Metrics**: Focus on appointments, not technical metrics

### 4. Post-Purchase Experience

#### Success Page Flow
1. **Stripe Checkout Complete** → Redirect to `/success?session_id=xxx`
2. **Welcome Message**: Congratulations with clear next steps
3. **Timeline Communication**: "Ads live in 72 hours" messaging
4. **Portal Access**: Direct link to customer dashboard

#### Customer Portal Features
- **Real-time Status**: Show campaign preparation progress
- **Performance Metrics**: Appointments booked, cost per appointment, revenue
- **Sample Data Toggle**: Preview what appointments will look like
- **Clear Next Steps**: Checklist of what's completed and what's coming

### 5. Integration Points

#### Stripe Webhook Processing
1. **Payment Verification**: Validate webhook signature
2. **Customer Creation**: Store business details in database
3. **Campaign Setup**: Create "Winter Special" placeholder campaign
4. **Timeline Setting**: 72-hour launch countdown
5. **Welcome Email Trigger**: (Implementation planned)

#### Error Handling Strategy
- **Graceful Degradation**: Show success even if webhook fails
- **Retry Logic**: Webhook processing can be replayed
- **Customer Support**: Clear contact information on all pages

## Technical Implementation

### Environment Configuration
- **Stripe Keys**: Test mode for development, production keys for live
- **Webhook Secrets**: Secure signature validation
- **Database URLs**: Supabase configuration with RLS
- **Base URL**: Dynamic for different environments

### Path Resolution
- **TypeScript Aliases**: `@/lib/*` for clean imports
- **Module Organization**: Clear separation of concerns
  - `/lib/stripe.ts`: Payment processing
  - `/lib/supabase.ts`: Database operations
  - `/lib/database.types.ts`: TypeScript definitions

### Testing Strategy
- **End-to-End Tests**: Complete purchase flow validation
- **Page Component Tests**: Individual page functionality
- **Mock Data**: Realistic contractor scenarios
- **Error Scenarios**: Timeout handling, network failures

## Why These Decisions

### 1. Business-First Approach
Every technical decision prioritizes contractor understanding and success metrics that matter to their business.

### 2. Immediate Value Demonstration
Post-purchase experience immediately shows value and sets clear expectations about timeline and results.

### 3. Scalable Architecture
Database schema and API structure support multiple campaigns, appointment types, and future expansion to other contractor verticals.

### 4. Clear Communication
All messaging focuses on appointments (outcomes) rather than leads (inputs), matching our value proposition.

## Next Steps (Future Phases)

### Phase 3: Email Integration
- Welcome email sequence
- Campaign launch notifications
- Weekly performance reports

### Phase 4: Real Campaign Management
- Actual ad campaign integration
- Budget management tools
- Performance optimization

### Phase 5: Appointment Management
- Calendar integration
- Lead scoring and qualification
- Revenue tracking and reporting

## URL Structure & Routing

Following project conventions for clear, contractor-friendly URLs:
- `/get-started` - Purchase page
- `/success` - Post-purchase confirmation  
- `/my-appointments` - Primary dashboard
- `/my-campaigns` - Campaign management
- `/api/checkout` - Payment processing
- `/api/webhooks/stripe` - Payment completion