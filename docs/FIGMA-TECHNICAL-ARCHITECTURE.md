# Figma Integration Technical Architecture

## 🔄 Complete Data Flow Diagram

```
CUSTOMER DATA INPUT
├── Business Name: "Austin Windows Pro"
├── City: "Austin"  
├── Phone: "(512) 555-0123"
├── Logo URL: "https://customer.com/logo.png"
├── Primary Color: "#0066CC"
├── Business Intel: { type: "financing", urgency: "high" }
└── Campaign ID: "camp_12345"

↓ STEP 1: BUSINESS INTELLIGENCE PROCESSING

STRATEGIC ANGLE SELECTION
├── Input: Business Intel + Market Data
├── Algorithm: AI-driven angle prioritization
├── Output: ["financing", "energy", "speed"]
└── Reasoning: "High urgency + price sensitive = financing focus"

↓ STEP 2: IMAGE PROCESSING PIPELINE

LOGO PROCESSING
├── Download: customer.com/logo.png → local buffer
├── Background Removal: remove.bg API call
├── Optimization: resize to 200x200, format PNG
├── Upload: → CDN storage
└── Result: "https://cdn.windows-ad-kit.com/logos/processed_logo_12345.png"

BACKGROUND IMAGE SELECTION  
├── Angle: "financing" → family_home_interior.jpg
├── Angle: "energy" → energy_efficient_windows.jpg
├── Angle: "speed" → professional_installation.jpg
└── Source: Pre-curated stock image library

↓ STEP 3: FIGMA TEMPLATE INSTANTIATION

FIGMA API WORKFLOW:
┌─────────────────────────────────────────┐
│ 1. Get Component ID                     │
│    Input: angle="financing", size="1x1" │
│    API: GET /files/{fileKey}/components │
│    Result: component_id="123:456"       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 2. Upload Images to Figma               │
│    API: POST /images (multipart form)   │
│    Logo: processed_logo_12345.png       │
│    Background: family_home_interior.jpg │
│    Result: { logo: "img_001", bg: "img_002" } │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 3. Create Working File                  │
│    API: POST /files                     │
│    Template: master_template_file_key   │
│    Result: working_file_key="abc123"    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 4. Create Component Instance            │
│    API: POST /files/{workingKey}/nodes  │
│    Component: component_id="123:456"    │
│    Variables: {                         │
│      headline: "New Windows in Austin - $0 Down!"│
│      subheadline: "Austin Windows Pro - Premium"│
│      cta: "Get Free Quote Today"        │
│      phone: "(512) 555-0123"           │
│      primary_color: "#0066CC"          │
│      logo_image: "img_001"             │
│      background_image: "img_002"       │
│    }                                   │
│    Result: instance_node_id="789:012"  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│ 5. Export as Image                      │
│    API: GET /images/{workingKey}        │
│    Params: ids=789:012&format=png&scale=2│
│    Result: export_url="https://figma-export.s3.amazonaws.com/abc123.png"│
└─────────────────────────────────────────┘

↓ STEP 4: MULTI-RATIO GENERATION

REPEAT FOR ALL RATIOS:
├── 1x1 (1080x1080) → Instagram/Facebook Square
├── 16x9 (1920x1080) → Facebook Feed/YouTube  
├── 4x5 (1080x1350) → Instagram Feed Optimized
└── 9x16 (1080x1920) → Instagram/Facebook Stories

PARALLEL PROCESSING:
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  financing  │   energy    │    speed    │    trust    │
│     1x1     │     1x1     │     1x1     │     1x1     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│  financing  │   energy    │    speed    │    trust    │
│    16x9     │    16x9     │    16x9     │    16x9     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│  financing  │   energy    │    speed    │    trust    │
│     4x5     │     4x5     │     4x5     │     4x5     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│  financing  │   energy    │    speed    │    trust    │
│    9x16     │    9x16     │    9x16     │    9x16     │
└─────────────┴─────────────┴─────────────┴─────────────┘
= 16 unique ads generated per campaign

↓ STEP 5: QUALITY ASSURANCE PIPELINE

AUTOMATED CHECKS:
├── Image Resolution: ≥ 1080px minimum dimension
├── Text Readability: Contrast ratio ≥ 4.5:1
├── Logo Visibility: Logo occupies 8-15% of canvas
├── Brand Consistency: Colors match brand guidelines
├── Platform Compliance: Meets FB/Instagram specs
└── File Size: < 8MB for platform upload

QUALITY SCORING:
┌─────────────────────────────────┐
│ Quality Score Calculation:      │
│ ├── Resolution: 20 points       │
│ ├── Contrast: 20 points         │
│ ├── Composition: 20 points      │
│ ├── Brand Alignment: 20 points  │
│ ├── Platform Compliance: 20 pts │
│ └── Total: /100 points          │
│                                 │
│ Threshold: 80+ = Auto-approve   │
│           60-79 = Manual review │
│           <60 = Regenerate      │
└─────────────────────────────────┘

↓ STEP 6: CUSTOMER PREVIEW SYSTEM

PREVIEW GENERATION:
├── Low-res preview (scale=1): For customer approval
├── Watermarked version: Prevents unauthorized use
├── Approval interface: Approve/reject/request changes
└── High-res delivery: After payment + approval

↓ STEP 7: FINAL ASSET DELIVERY

DELIVERY PACKAGE:
├── File Format: PNG (primary), JPG (backup)
├── Naming Convention: "AustinWindowsPro_financing_1x1_v1.png"
├── Download Links: Expires in 7 days
├── Usage Rights: Commercial license included
└── Platform Specs: Ready for direct upload

FINAL OUTPUT:
www.windows-ad-kit.com/downloads/camp_12345/
├── AustinWindowsPro_financing_1x1.png (1080x1080)
├── AustinWindowsPro_financing_16x9.png (1920x1080)
├── AustinWindowsPro_financing_4x5.png (1080x1350)
├── AustinWindowsPro_financing_9x16.png (1080x1920)
├── AustinWindowsPro_energy_1x1.png
├── ... (16 total files)
└── campaign_summary.pdf
```

## 🏗️ Component Architecture Breakdown

### Figma Template Structure (EXACT LAYOUT)

```
COMPONENT: "Windows_Ad_Financing / Size=1x1" (1080x1080px)
┌─────────────────────────────────────────────────────────┐
│                    BACKGROUND LAYER                     │ ← background_image
│  ┌─────────────┐                                       │
│  │    LOGO     │ ← logo_image (200x200px, top-left)   │
│  └─────────────┘                                       │
│                                                         │
│              HERO IMAGE AREA                           │ ← hero_image (center)
│          ┌─────────────────────┐                       │
│          │  Professional Window │                       │
│          │   Installation Photo │                       │
│          └─────────────────────┘                       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              TEXT OVERLAY AREA                  │   │
│  │                                                 │   │
│  │  "New Windows in Austin - $0 Down!"           │   │ ← headline_text
│  │  Austin Windows Pro - Premium Quality          │   │ ← subheadline_text  
│  │                                                 │   │
│  │  ┌─────────────────────────┐                  │   │
│  │  │  📞 (512) 555-0123     │ ← phone_text     │   │
│  │  └─────────────────────────┘                  │   │
│  │                                                 │   │
│  │  ┌─────────────────────────┐                  │   │
│  │  │  Get Free Quote Today   │ ← cta_text       │   │
│  │  └─────────────────────────┘                  │   │
│  │                                                 │   │
│  │  *Subject to credit approval                   │   │ ← legal_text
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

RESPONSIVE VARIATIONS:
├── 16x9: Horizontal layout, logo left, text right
├── 4x5: Vertical layout, optimized for mobile feed
└── 9x16: Story format, vertical text stacking
```

### Dynamic Text Generation Logic

```typescript
function generateDynamicText(
  angle: string,
  businessData: {
    name: string
    city: string  
    phone: string
    businessIntel: BusinessIntelligence
  }
): AdText {
  
  const baseTemplates = {
    financing: {
      headline: `New Windows in ${businessData.city} - $0 Down!`,
      subheadline: `${businessData.name} - Premium Quality`,
      cta: "Get Free Quote Today",
      legal: "*Subject to credit approval. See store for details."
    },
    energy: {
      headline: `${businessData.city} Energy Rebates - Save Big!`,
      subheadline: `${businessData.name} - Energy Experts`, 
      cta: "Check Rebate Eligibility",
      legal: "*Rebates subject to utility company programs."
    },
    speed: {
      headline: `Quick Windows in ${businessData.city}`,
      subheadline: `${businessData.name} - Fast & Professional`,
      cta: "Book Installation",
      legal: "*Installation timeframes subject to scheduling."
    },
    trust: {
      headline: `${businessData.city}'s Most Trusted Window Company`,
      subheadline: `${businessData.name} - 10+ Years Experience`,
      cta: "Get Expert Consultation", 
      legal: "*Warranty terms vary by product."
    }
  }

  // Apply business intelligence customization
  let template = baseTemplates[angle]
  
  if (businessData.businessIntel.yearsInBusiness === '10_plus') {
    template.subheadline = `${businessData.name} - 10+ Years Trusted`
  }
  
  if (businessData.businessIntel.avgProjectValue >= '12000') {
    template.headline = template.headline.replace('$0 Down', 'Premium Windows - $0 Down')
  }
  
  return template
}
```

## 🔧 EXACT IMPLEMENTATION STEPS

### Step 1: Figma Setup (Day 1-2)

```bash
# 1. Create Figma Personal Access Token
# → Go to figma.com/settings
# → Generate token with "File content" scope
# → Add to .env.local

# 2. Create template file structure
# → Use provided component specifications
# → Publish to team library
# → Record all component IDs
```

### Step 2: API Integration (Day 3-5)

```typescript
// 1. Replace mock service with real implementation
// src/app/api/figma/generate/route.ts

import { realFigmaService } from '@/lib/figma-real'

export async function POST(request: NextRequest) {
  const data = await request.json()
  
  try {
    // Real Figma generation
    const result = await realFigmaService.generateCompleteAdSet({
      businessName: data.businessName,
      city: data.city,
      phone: data.phone,
      logoUrl: data.logoUrl,
      colors: { 
        primary: data.primaryColor || '#0066CC',
        secondary: data.secondaryColor || '#333333'
      },
      angles: data.selectedAngles,
      pricing: data.price,
      campaignId: data.campaignId
    })

    return NextResponse.json({
      success: true,
      workingFileKey: result.workingFileKey,
      ads: result.ads,
      totalAds: result.ads.length,
      mode: 'production'
    })

  } catch (error) {
    // Fallback to mock system
    console.error('Figma generation failed:', error)
    return fallbackToMockGeneration(data)
  }
}
```

### Step 3: Logo Processing (Day 6-7)

```typescript
// src/lib/logo-processor.ts

import { RemoveBgApi } from '@remove-bg/api'

export async function processLogo(logoUrl: string): Promise<string> {
  // 1. Download original logo
  const response = await fetch(logoUrl)
  const buffer = await response.arrayBuffer()
  
  // 2. Remove background using remove.bg
  const removeBg = new RemoveBgApi(process.env.REMOVE_BG_API_KEY!)
  const result = await removeBg.removeBackgroundFromImageBuffer(buffer)
  
  // 3. Optimize for Figma upload
  const optimized = await optimizeImage(result, {
    maxWidth: 400,
    maxHeight: 400,
    format: 'PNG'
  })
  
  // 4. Upload to your CDN
  const processedUrl = await uploadToCDN(optimized, 'logos/')
  
  return processedUrl
}
```

### Step 4: Testing & Validation (Day 8-10)

```typescript
// Test script: scripts/test-figma-integration.ts

async function testRealFigmaGeneration() {
  const testData = {
    businessName: "Test Windows Co",
    city: "Austin",
    phone: "(512) 555-TEST",
    logoUrl: "https://example.com/test-logo.png",
    selectedAngles: ["financing"],
    campaignId: "test_" + Date.now()
  }

  console.log('Testing real Figma generation...')
  
  const result = await realFigmaService.generateCompleteAdSet(testData)
  
  console.log('✅ Generated working file:', result.workingFileKey)
  console.log('✅ Created ads:', result.ads.length)
  
  // Validate each export URL
  for (const ad of result.ads) {
    const response = await fetch(ad.exportUrl)
    console.log(`✅ ${ad.angle}_${ad.size}: ${response.status === 200 ? 'VALID' : 'INVALID'}`)
  }
}

testRealFigmaGeneration()
```

## 🎯 SUCCESS CRITERIA

### Technical Validation
- [ ] Figma API successfully creates component instances
- [ ] Logo processing removes backgrounds correctly
- [ ] All 4 aspect ratios generate properly
- [ ] Export URLs return valid PNG files
- [ ] Text overlays display customer data accurately
- [ ] Colors match brand specifications

### Business Validation  
- [ ] Generated ads look professional and deployment-ready
- [ ] Customer data populates correctly in all fields
- [ ] Strategic angles reflect business intelligence
- [ ] Quality scores consistently above 80
- [ ] Download process works end-to-end
- [ ] Customer can deploy ads immediately to platforms

### Performance Benchmarks
- [ ] Complete campaign generation < 5 minutes
- [ ] Individual ad generation < 30 seconds  
- [ ] API success rate > 95%
- [ ] Export URL validity > 99%
- [ ] Customer approval rate > 85%

---

**This technical architecture transforms Windows Ad Kit from a mock template system into a real creative automation platform that generates actual, deployable advertising campaigns using Figma's professional design tools.**