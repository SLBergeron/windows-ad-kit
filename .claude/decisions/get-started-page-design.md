# Get Started Page Design Decisions

**Date**: 2025-08-19
**Context**: Initial implementation of the /get-started page for Windows Ad Kit

## Key Decisions Made

### 1. Design Approach
- **Used Grand Slam Offer template**: Incorporated proven conversion elements from the provided HTML template
- **Dark theme**: Matches professional contractor market expectations (#1a2332, #ff6b35 accent)
- **Mobile-first responsive design**: Contractors often browse on mobile devices

### 2. Core Value Proposition
- **Headline**: "The Only Ad System That Guarantees 20 Appointments in 28 Days Or We Work For Free"
- **Key messaging**: Focus on appointments (not leads), guaranteed results, 72-hour installation
- **Price point**: Clear $295 one-time payment, no monthly fees

### 3. Trust & Urgency Elements
- **72-hour countdown timer**: Creates scarcity and urgency
- **Guarantee badges**: 100% money-back + work-until-results guarantee
- **Social proof**: Referenced $2.3M+ revenue generated for contractors
- **Clear features**: Installation support, guarantee, one-time payment

### 4. Form Design
- **Minimal friction**: Only business name and city required
- **Clear labels**: "Business Name" and "City" (not technical jargon)
- **Validation**: Button disabled until both fields completed
- **Visual feedback**: Processing state with button text change

### 5. Testing Strategy
- **Playwright test**: Covers complete user journey from landing to purchase
- **Clear assertions**: Tests for headline text, form functionality, success message
- **Local development**: Tests run against localhost:3000 for development

## Why These Decisions

1. **Conversion-focused**: Used proven elements from high-converting sales pages
2. **Contractor-specific**: Language and design appeals to blue-collar professionals
3. **Trust-first**: Multiple guarantee elements reduce purchase anxiety
4. **Simple flow**: Minimal steps from landing to purchase decision
5. **Test-driven**: Every element is validated by automated tests

## Next Steps
- Add Stripe integration for actual payments
- Implement email/SMS follow-up sequences
- A/B test different headlines and value propositions
- Add more social proof elements (testimonials, stats)

## URL Structure
Following project conventions:
- Clear, non-technical URL: `/get-started` 
- Matches CUSTOMER_ROUTES.GET_STARTED constant
- SEO-friendly and easy to remember for contractors