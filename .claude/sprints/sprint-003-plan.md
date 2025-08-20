# Sprint 003: DIY Ad Generation System 🎨 PLANNING

## Sprint Goal
Enable $295 DIY customers to generate personalized ads using their business data merged with Figma templates, providing a complete self-service ad creation experience.

## Success Criteria
- ✅ Customer can preview ads with their business name/city
- ✅ Customer can customize basic elements (headlines, colors, CTAs)  
- ✅ Customer can download ads in multiple formats (social, print, web)
- ✅ Campaign auto-progresses from "draft" → "active" after ad approval
- ✅ Generated ads stored and accessible via portal

## User Story
```
As a DIY contractor who purchased the $295 kit,
I want to generate professional ads with my business information,
So I can launch my campaigns without needing design skills.

Flow: Portal → "Generate My Ads" → Preview → Customize → Download → Approve → Campaign Goes Live
```

## Technical Architecture

### 1. Database Schema Extensions
```sql
-- Ad Templates (Figma file references)
CREATE TABLE ad_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  campaign_type VARCHAR(50), -- 'winter_special', etc.
  figma_file_id VARCHAR(255) NOT NULL,
  figma_node_id VARCHAR(255) NOT NULL,
  template_variables JSONB NOT NULL, -- {business_name, city, phone}
  preview_image_url TEXT,
  format_specs JSONB, -- {social: {width: 1080, height: 1080}, etc}
  status VARCHAR(20) DEFAULT 'active'
);

-- Customer Generated Ads
CREATE TABLE customer_ads (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  campaign_id UUID REFERENCES campaigns(id),
  template_id UUID REFERENCES ad_templates(id),
  figma_export_urls JSONB, -- {jpg: 'url', png: 'url', pdf: 'url'}
  customizations JSONB, -- customer overrides
  generation_status VARCHAR(20) DEFAULT 'pending', -- pending, generating, ready, failed
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign status updates
ALTER TABLE campaigns ADD COLUMN ad_generation_status VARCHAR(20) DEFAULT 'not_started';
-- not_started → generating → ready_for_review → approved → active
```

### 2. Figma Integration APIs
```typescript
// Core APIs needed
POST /api/templates/generate          // Generate ads for customer campaign
GET  /api/customer/{id}/ads           // List customer's generated ads  
PUT  /api/ads/{id}/customize         // Apply customer customizations
POST /api/ads/{id}/regenerate        // Regenerate with new data
GET  /api/ads/{id}/download/{format} // Download specific format
POST /api/campaigns/{id}/approve-ads // Progress campaign to active
```

### 3. Portal Integration
New portal section: **"My Ad Templates"**
- Tab in existing /my-campaigns portal
- Preview ads with customer data merged
- Simple customization interface
- Download/approval workflow
- Campaign status progression

## Implementation Phases

### Phase 1: Template Management Foundation (2-3 days)
- [ ] Extend database schema for templates and customer ads
- [ ] Create template management APIs (admin-focused initially)
- [ ] Basic Figma API integration for file fetching
- [ ] Template seeding with sample "Winter Special" templates

### Phase 2: Ad Generation Engine (3-4 days)  
- [ ] Customer data → Figma template merge logic
- [ ] Multi-format export (JPG, PNG, PDF for different use cases)
- [ ] Asset storage in Supabase Storage
- [ ] Generation status tracking and error handling

### Phase 3: Customer Portal Integration (2-3 days)
- [ ] "My Ad Templates" tab in portal
- [ ] Ad preview with customer data
- [ ] Basic customization interface (text overrides)
- [ ] Download functionality
- [ ] Campaign approval workflow

### Phase 4: Campaign Automation (1-2 days)
- [ ] Auto-generate ads when campaign reaches "active" status
- [ ] Campaign status progression automation
- [ ] Email notifications at each stage
- [ ] Scheduled tasks for campaign lifecycle management

## Critical Integration Points

### Figma API Requirements
```javascript
// Template structure you'll need
{
  fileId: "abc123",
  nodeId: "1:2345", 
  variableNodes: {
    "business_name": "1:2346",
    "city": "1:2347", 
    "phone": "1:2348",
    "headline": "1:2349"
  },
  exportSettings: {
    formats: ["JPG", "PNG", "PDF"],
    scales: [1, 2], // @1x, @2x for social
  }
}
```

### Customer Data Schema
```typescript
interface CustomerAdData {
  business_name: string;    // "Mike's Windows LLC"
  city: string;            // "Dallas"  
  email: string;           // For contact info
  phone?: string;          // Optional phone number
  campaign_type: string;   // "winter_special"
  
  // Customer customizations
  custom_headline?: string;
  custom_cta?: string;
  brand_colors?: {primary: string; secondary: string};
}
```

## Dependencies & Blockers
- **Figma Templates**: Need templates with proper variable tokens
- **Figma API Access**: Tokens and team permissions
- **Asset Storage**: Supabase Storage configuration
- **Email System**: Notifications for ad generation status

## Testing Strategy
- Unit tests for Figma API integration
- Integration tests for complete ad generation flow  
- E2E tests for customer portal ad customization
- Performance tests for multiple ad generation
- Manual testing with real customer data

## Definition of Done
- [ ] Customer can generate ads from portal within 5 minutes
- [ ] Generated ads contain correct business information
- [ ] Customer can download in multiple formats
- [ ] Campaign automatically progresses to "active" after approval
- [ ] System handles concurrent ad generation requests
- [ ] All error states have user-friendly messaging
- [ ] Admin can manage templates through interface

## Next Sprint Preview
**Sprint 004: Advanced Customization & Campaign Analytics**
- Advanced ad customization options
- A/B testing for ad variations
- Campaign performance tracking
- Lead source attribution
- Appointment booking analytics

Ready to begin implementation once Figma templates are prepared! 🚀