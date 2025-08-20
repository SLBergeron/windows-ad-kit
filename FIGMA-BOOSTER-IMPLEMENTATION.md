# Figma Booster Platform Implementation Guide

## 🎯 STRATEGIC MISSION: Progressive Template System

This guide implements the **Booster Platform strategy** through a progressive Figma template creation approach:
1. **Start Simple** → Single working file with one angle, all formats
2. **Add Angles** → Expand to multiple marketing angles within the pack
3. **Add Variants** → Create template variations for customer choice
4. **Replicate Packs** → Copy successful structure to new template packs

---

## 🚀 PHASE 1: Single Working File Foundation (Week 1)

### Step 1.1: Create MVP Base Pack File

**Start with ONE perfect file, not multiple complex ones**

**Actions Required:**
1. **Login to Figma** with your team account
2. **Create new file**: "Windows Ad Kit - Base Pack v1"
3. **Focus on ONE angle** to prove the system works

```
File Structure:
"Windows Ad Kit - Base Pack v1"
└── Page: "Base Pack Templates"
    ├── Cover Page (Optional branding)
    ├── Component Set: "Base_Financing"
    │   ├── Property: Format (1x1, 16x9, 4x5, 9x16)
    │   ├── Variant: Financing / Format=1x1 (1080x1080)
    │   ├── Variant: Financing / Format=16x9 (1920x1080)
    │   ├── Variant: Financing / Format=4x5 (1080x1350)
    │   └── Variant: Financing / Format=9x16 (1080x1920)
    └── Assets Library:
        ├── Brand Colors (Primary, Secondary)
        ├── Logo Placeholders
        ├── Background Images
        └── Stock Photos (Windows-related)
```

**Why This Approach:**
- ✅ Prove technical workflow with minimal complexity
- ✅ Test Figma API integration thoroughly
- ✅ Validate customer experience early
- ✅ Build team confidence before scaling
- ✅ Quick wins and immediate value

### Step 1.2: Perfect Single Component Set

**Component Set: "Base_Financing"**
```
Properties:
├── Format: 1x1, 16x9, 4x5, 9x16
└── (Start with just Format - don't add variants yet)

Layer Structure (CONSISTENT across all formats):
├── Background Layer
├── Hero Image Container
├── Logo Container (Auto-layout)
├── Text Container (Auto-layout)
│   ├── Headline Text
│   ├── Subheadline Text  
│   ├── CTA Button
│   ├── Phone Text
│   ├── Price Text (Optional)
│   └── Legal Text
└── Overlay Effects (Optional)
```

### Step 1.3: Component Variables Setup

**In Figma, create these variables for the component set:**

```javascript
// Text Variables (String type)
headline_text = "New Windows in [City] - $0 Down!"
subheadline_text = "[Business Name] - Premium Quality"
cta_text = "Get Free Quote Today"  
phone_text = "(555) 123-4567"
price_text = "Starting at $299/month"
legal_text = "*Subject to credit approval. See store for details."

// Color Variables (Color type)
primary_color = #0066CC
secondary_color = #333333
accent_color = #FF6B35

// Boolean Variables 
show_price = false
show_legal = true
show_urgency = false

// Text Style Variables
headline_size = 48px (1x1), 56px (16x9), 42px (4x5), 52px (9x16)
```

### Step 1.4: Environment Configuration

**Update `.env.local` with simple structure:**
```env
# Figma Configuration
FIGMA_ACCESS_TOKEN="[YOUR_PERSONAL_ACCESS_TOKEN]"
FIGMA_TEAM_ID="[YOUR_TEAM_ID]"

# Base Pack File (START HERE)
FIGMA_BASE_PACK_FILE_KEY="[BASE_PACK_FILE_KEY]"

# Base Pack Component IDs (Only 4 to start)
FIGMA_BASE_FINANCING_1x1_ID="[COMPONENT_ID]"
FIGMA_BASE_FINANCING_16x9_ID="[COMPONENT_ID]"
FIGMA_BASE_FINANCING_4x5_ID="[COMPONENT_ID]"
FIGMA_BASE_FINANCING_9x16_ID="[COMPONENT_ID]"
```

### Step 1.5: Test & Validate Foundation

**Create test script to validate single pack:**
```typescript
// scripts/test-base-pack.ts
async function testBasePack() {
  const testData = {
    businessName: "Austin Windows Pro",
    city: "Austin",
    phone: "(512) 555-0123",
    logoUrl: "https://example.com/test-logo.png",
    angle: "financing", // Only test one angle
    formats: ["1x1", "16x9"] // Start with 2 formats
  }

  console.log('🧪 Testing Base Pack Generation...')
  
  for (const format of testData.formats) {
    const result = await figmaService.generateAd({
      ...testData,
      format,
      componentId: process.env[`FIGMA_BASE_FINANCING_${format.toUpperCase()}_ID`]
    })
    
    console.log(`✅ ${format}: ${result.success ? 'SUCCESS' : 'FAILED'}`)
  }
}
```

---

## 🎯 PHASE 2: Add Multiple Angles (Week 2)

### Step 2.1: Expand Base Pack File

**Add more component sets to the SAME file:**

```
"Windows Ad Kit - Base Pack v1" (Updated)
└── Page: "Base Pack Templates"
    ├── Component Set: "Base_Financing" ✅ (Already done)
    ├── Component Set: "Base_Energy" 🆕
    │   ├── Variant: Energy / Format=1x1
    │   ├── Variant: Energy / Format=16x9
    │   ├── Variant: Energy / Format=4x5
    │   └── Variant: Energy / Format=9x16
    ├── Component Set: "Base_Speed" 🆕
    │   └── [Same format structure]
    └── Component Set: "Base_Trust" 🆕
        └── [Same format structure]
```

### Step 2.2: Angle-Specific Customization

**Each angle gets its own messaging and imagery:**

```typescript
// Angle-specific content strategy
const ANGLE_SPECIFICATIONS = {
  financing: {
    headline_template: "New Windows in [City] - $0 Down!",
    hero_image_type: "family_home_interior",
    primary_color: "#0066CC", // Trust blue
    cta_focus: "financing_offers"
  },
  energy: {
    headline_template: "[City] Energy Rebates - Save Big!",
    hero_image_type: "energy_efficient_windows",
    primary_color: "#28A745", // Green for energy
    cta_focus: "rebate_eligibility"
  },
  speed: {
    headline_template: "Quick Windows in [City]",
    hero_image_type: "professional_installation",
    primary_color: "#FF6B35", // Orange for urgency
    cta_focus: "fast_scheduling"
  },
  trust: {
    headline_template: "[City]'s Most Trusted Window Company",
    hero_image_type: "experienced_team",
    primary_color: "#6F42C1", // Purple for premium
    cta_focus: "reputation_credentials"
  }
}
```

### Step 2.3: Update Environment Variables

**Add new component IDs:**
```env
# Base Pack - All Angles (16 total components)
FIGMA_BASE_FINANCING_1x1_ID="[ID]"
FIGMA_BASE_FINANCING_16x9_ID="[ID]"
FIGMA_BASE_FINANCING_4x5_ID="[ID]"
FIGMA_BASE_FINANCING_9x16_ID="[ID]"

FIGMA_BASE_ENERGY_1x1_ID="[ID]"
FIGMA_BASE_ENERGY_16x9_ID="[ID]"
FIGMA_BASE_ENERGY_4x5_ID="[ID]"
FIGMA_BASE_ENERGY_9x16_ID="[ID]"

FIGMA_BASE_SPEED_1x1_ID="[ID]"
FIGMA_BASE_SPEED_16x9_ID="[ID]"
FIGMA_BASE_SPEED_4x5_ID="[ID]"
FIGMA_BASE_SPEED_9x16_ID="[ID]"

FIGMA_BASE_TRUST_1x1_ID="[ID]"
FIGMA_BASE_TRUST_16x9_ID="[ID]"
FIGMA_BASE_TRUST_4x5_ID="[ID]"
FIGMA_BASE_TRUST_9x16_ID="[ID]"
```

---

## 🎨 PHASE 3: Add Template Variants (Week 3)

### Step 3.1: Create Variant Versions

**Now add design variations within each angle:**

```
Component Set: "Base_Financing" (Updated)
├── Properties:
│   ├── Format: 1x1, 16x9, 4x5, 9x16
│   └── Variant: Conservative, Aggressive 🆕
├── Variants:
│   ├── Financing / Format=1x1 / Variant=Conservative
│   ├── Financing / Format=1x1 / Variant=Aggressive
│   ├── Financing / Format=16x9 / Variant=Conservative
│   ├── Financing / Format=16x9 / Variant=Aggressive
│   └── [Continue for all format/variant combinations]
```

### Step 3.2: Variant Design Strategy

**Conservative vs. Aggressive variants:**

```typescript
const VARIANT_SPECIFICATIONS = {
  conservative: {
    design_approach: "Professional, trustworthy, understated",
    color_intensity: "Muted, traditional",
    typography: "Classic fonts, smaller sizes",
    messaging_tone: "Gentle, informative",
    visual_elements: "Minimal, clean lines"
  },
  aggressive: {
    design_approach: "Bold, attention-grabbing, urgent",
    color_intensity: "Bright, high contrast", 
    typography: "Bold fonts, larger sizes",
    messaging_tone: "Direct, urgent, benefit-focused",
    visual_elements: "Dynamic, eye-catching"
  }
}
```

### Step 3.3: Customer Template Selection

**Enable customer choice in the interface:**

```typescript
// Template selection logic
export async function getTemplateChoices(customerId: string, angle: string, format: string) {
  const availableTemplates = [
    {
      id: `base_${angle}_${format}_conservative`,
      name: `${angle} - Professional Style`,
      variant: "conservative",
      preview_url: await generatePreview(angle, format, "conservative"),
      recommendation: "Best for established businesses"
    },
    {
      id: `base_${angle}_${format}_aggressive`, 
      name: `${angle} - Bold Style`,
      variant: "aggressive",
      preview_url: await generatePreview(angle, format, "aggressive"),
      recommendation: "Best for competitive markets"
    }
  ]

  return availableTemplates
}
```

---

## 📦 PHASE 4: Pack Replication System (Week 4)

### Step 4.1: Template Pack Structure

**Now replicate the successful Base Pack structure:**

```
Pack Ecosystem:
├── "Windows Ad Kit - Base Pack v1" ✅ (16 components × 2 variants = 32)
├── "Windows Ad Kit - Modern Style Pack v1" 🆕
├── "Windows Ad Kit - Seasonal Spring Pack v1" 🆕  
├── "Windows Ad Kit - Luxury Industry Pack v1" 🆕
└── "Windows Ad Kit - Performance Pack v1" 🆕
```

### Step 4.2: Pack Replication Workflow

**Systematic process for creating new packs:**

1. **Duplicate Base Pack File**
   ```
   File → Duplicate → "Windows Ad Kit - [PACK_NAME] v1"
   ```

2. **Update Pack Branding**
   ```
   - Cover page with pack name and description
   - Color scheme adjustments for pack theme
   - Typography updates for pack personality
   ```

3. **Customize Component Content**
   ```
   - Update component naming: "Modern_Financing", "Modern_Energy"
   - Adjust design elements for pack theme
   - Update hero images and backgrounds
   - Modify text styling and layout
   ```

4. **Publish & Configure**
   ```
   - Publish components to team library
   - Record component IDs in environment
   - Update database with pack information
   ```

### Step 4.3: Environment Scaling Strategy

**Scalable environment variable structure:**

```env
# Base Pack
FIGMA_BASE_PACK_FILE_KEY="[FILE_KEY]"
FIGMA_BASE_FINANCING_1x1_CONSERVATIVE_ID="[ID]"
FIGMA_BASE_FINANCING_1x1_AGGRESSIVE_ID="[ID]"
# ... continue pattern

# Modern Style Pack  
FIGMA_MODERN_PACK_FILE_KEY="[FILE_KEY]"
FIGMA_MODERN_FINANCING_1x1_CONSERVATIVE_ID="[ID]"
FIGMA_MODERN_FINANCING_1x1_AGGRESSIVE_ID="[ID]"
# ... continue pattern

# Seasonal Spring Pack
FIGMA_SPRING_PACK_FILE_KEY="[FILE_KEY]"
FIGMA_SPRING_FINANCING_1x1_FRESH_ID="[ID]"
FIGMA_SPRING_FINANCING_1x1_VIBRANT_ID="[ID]"
# ... continue pattern
```

### Step 4.4: Dynamic Component Resolution

**Replace hard-coded IDs with dynamic lookup:**

```typescript
// src/lib/figma-component-resolver.ts
export class ComponentResolver {
  async resolveComponentId(criteria: {
    packSlug: string,
    angle: string,
    format: string,
    variant: string
  }): Promise<string> {
    
    const { packSlug, angle, format, variant } = criteria
    
    // Dynamic environment variable construction
    const envKey = `FIGMA_${packSlug.toUpperCase()}_${angle.toUpperCase()}_${format.toUpperCase()}_${variant.toUpperCase()}_ID`
    
    const componentId = process.env[envKey]
    
    if (!componentId) {
      throw new Error(`Component not found: ${envKey}`)
    }
    
    return componentId
  }

  async getPackTemplates(packSlug: string): Promise<Template[]> {
    // Query database for all templates in this pack
    const { data: templates } = await supabase
      .from('templates')
      .select('*')
      .eq('pack_slug', packSlug)
      .eq('is_active', true)
    
    return templates || []
  }
}
```

---

## 🔄 PROGRESSIVE IMPLEMENTATION TIMELINE

### Week 1: Foundation Success
- ✅ One file, one angle (financing), all formats (4 components)
- ✅ Prove Figma API integration works
- ✅ Generate real ads with customer data
- ✅ Validate customer experience

### Week 2: Angle Expansion  
- ✅ Add 3 more angles to same file (16 total components)
- ✅ Test angle-specific messaging and imagery
- ✅ Validate strategic angle selection works
- ✅ Prove scalability within single file

### Week 3: Variant Introduction
- ✅ Add conservative/aggressive variants (32 total components)
- ✅ Enable customer template selection
- ✅ Test variant performance differences
- ✅ Validate customer choice preferences

### Week 4: Pack Replication
- ✅ Create second pack using proven structure
- ✅ Test pack management system
- ✅ Validate customer pack purchasing
- ✅ Prove replication scalability

---

## 🎯 SUCCESS METRICS BY PHASE

### Phase 1 Metrics (Foundation)
- [ ] 4 components working (financing × 4 formats)
- [ ] 100% API success rate for test generation
- [ ] Real downloadable PNG files produced
- [ ] Customer data populates correctly

### Phase 2 Metrics (Angle Expansion)
- [ ] 16 components working (4 angles × 4 formats)
- [ ] Strategic angle selection working
- [ ] Angle-specific messaging generating correctly
- [ ] Customer can see angle differences

### Phase 3 Metrics (Variant Addition)
- [ ] 32 components working (4 angles × 4 formats × 2 variants)
- [ ] Customer template selection interface working
- [ ] Variant performance tracking enabled
- [ ] Customer choice preferences recorded

### Phase 4 Metrics (Pack Replication)
- [ ] Second pack created and functional
- [ ] Pack purchasing flow working
- [ ] Customer entitlements system working
- [ ] Revenue from pack upsells recorded

---

## 🚀 TECHNICAL MIGRATION STRATEGY

### Database Schema Evolution

**Phase 1: Simple Tracking**
```sql
-- Just track basic generation
CREATE TABLE ad_generations (
  id UUID PRIMARY KEY,
  customer_id UUID,
  campaign_id UUID,
  component_id VARCHAR(100),
  generated_at TIMESTAMP
);
```

**Phase 4: Full Booster Platform**
```sql
-- Complete template registry (from previous documentation)
CREATE TABLE template_packs (...);
CREATE TABLE templates (...);
CREATE TABLE customer_pack_entitlements (...);
```

### API Evolution

**Phase 1: Simple Generation**
```typescript
// Just generate with fixed component ID
await figmaService.generateAd({
  componentId: process.env.FIGMA_BASE_FINANCING_1x1_ID,
  businessData: customerData
})
```

**Phase 4: Dynamic Resolution**
```typescript
// Dynamic template selection and generation
const template = await templateResolver.selectTemplate({
  customerId: 'cust_123',
  packPreference: 'modern-style',
  angle: 'financing',
  format: '1x1'
})

await figmaService.generateAd({
  componentId: template.figmaComponentId,
  businessData: customerData
})
```

---

## 💡 STRATEGIC ADVANTAGES OF PROGRESSIVE APPROACH

### 1. **Risk Mitigation**
- Start simple, prove concept works
- Build confidence before complexity
- Easy to debug and iterate
- Quick wins build momentum

### 2. **Customer Validation**
- Test real customer response early
- Gather feedback on core value proposition  
- Validate template quality standards
- Prove business model works

### 3. **Team Learning**
- Master Figma API integration
- Understand component management
- Learn customer preferences
- Build operational expertise

### 4. **Technical Foundation**
- Establish solid architecture
- Prove scalability approach
- Build reusable systems
- Create testing frameworks

### 5. **Business Validation**
- Prove template pack concept
- Validate pricing strategy
- Test customer acquisition
- Measure retention impact

**This progressive approach transforms Windows Ad Kit from concept to reality through validated, scalable steps that build on proven success rather than attempting everything at once.**