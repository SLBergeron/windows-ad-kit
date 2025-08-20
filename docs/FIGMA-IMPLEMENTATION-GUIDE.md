# Figma Real Implementation Guide

## 🚨 IMPORTANT: UPDATED STRATEGY AVAILABLE

**This guide has been superseded by the new Booster Platform approach.**

👉 **See: `/FIGMA-BOOSTER-IMPLEMENTATION.md`** for the progressive implementation strategy.

The new approach starts simple and scales systematically:
1. **Single working file** → Prove concept works
2. **Add angles** → Expand within proven structure  
3. **Add variants** → Enable customer choice
4. **Replicate packs** → Scale to multiple template packs

---

## 🎯 ORIGINAL MISSION: Create Real Figma Ad Generation System

This guide provides step-by-step instructions to build a **real, working Figma integration** that creates actual ad layouts and produces downloadable assets.

**Note: The approach below creates everything at once. For a more strategic, progressive approach, use the Booster Platform implementation guide instead.**

## Phase 1: Figma Template Setup (CRITICAL FOUNDATION)

### Step 1.1: Create Master Template File

**Actions Required:**
1. **Login to Figma** with your team account
2. **Create new file**: "Windows Ad Kit - Master Templates"
3. **Set up page structure**:

```
Page: "Ad Templates"
├── Frame: "1x1 Templates" (1080x1080)
├── Frame: "16x9 Templates" (1920x1080)  
├── Frame: "4x5 Templates" (1080x1350)
└── Frame: "9x16 Templates" (1080x1920)
```

### Step 1.2: Create Component Sets for Each Angle

**For EACH marketing angle, create a component set:**

#### Component Set: "Windows_Ad_Financing"
```
Properties:
├── Size: 1x1, 16x9, 4x5, 9x16
└── State: Default, Hover (optional)

Variants to Create:
├── Windows_Ad_Financing / Size=1x1
├── Windows_Ad_Financing / Size=16x9  
├── Windows_Ad_Financing / Size=4x5
└── Windows_Ad_Financing / Size=9x16
```

**Repeat for:**
- Windows_Ad_Energy
- Windows_Ad_Speed  
- Windows_Ad_Trust

### Step 1.3: Template Layer Structure (EXACT SPECIFICATION)

**Each variant component MUST have this layer structure:**

```
Component: "Windows_Ad_Financing / Size=1x1"
├── Layer: "Background" (Rectangle)
│   ├── Fill: Background color/image slot
│   └── Name: "background_slot"
├── Layer: "Hero Image" (Rectangle) 
│   ├── Fill: Image placeholder
│   └── Name: "hero_image_slot"
├── Layer: "Logo Container" (Frame)
│   ├── Logo: "Logo" (Rectangle)
│   │   ├── Fill: Image placeholder
│   │   └── Name: "logo_slot"
│   └── Constraints: Center, Top
├── Layer: "Text Container" (Frame)
│   ├── Text: "Headline" 
│   │   ├── Content: "New Windows in [City] - $0 Down!"
│   │   ├── Name: "headline_text"
│   │   └── Style: Bold, 48px, Primary Color
│   ├── Text: "Subheadline"
│   │   ├── Content: "[Business Name] - Premium Quality" 
│   │   ├── Name: "subheadline_text"
│   │   └── Style: Regular, 24px, Secondary Color
│   ├── Text: "CTA Button"
│   │   ├── Content: "Get Free Quote Today"
│   │   ├── Name: "cta_text"
│   │   └── Style: Bold, 20px, White on Primary
│   ├── Text: "Phone"
│   │   ├── Content: "(555) 123-4567"
│   │   ├── Name: "phone_text" 
│   │   └── Style: Bold, 18px, Primary Color
│   ├── Text: "Price" (Optional)
│   │   ├── Content: "Starting at $299/month"
│   │   ├── Name: "price_text"
│   │   └── Visible: Boolean property
│   └── Text: "Legal"
│       ├── Content: "*Subject to credit approval"
│       ├── Name: "legal_text"
│       └── Style: Regular, 12px, Gray
```

### Step 1.4: Set Up Component Variables

**In Figma, for EACH component, create these variables:**

```javascript
// Text Variables (String type)
headline_text = "New Windows in [City] - $0 Down!"
subheadline_text = "[Business Name] - Premium Quality"  
cta_text = "Get Free Quote Today"
phone_text = "(555) 123-4567"
price_text = "Starting at $299/month"
legal_text = "*Subject to credit approval"

// Color Variables (Color type)
primary_color = #0066CC
secondary_color = #333333

// Boolean Variables
show_price = false
show_legal = true

// Image Variables (would be handled via API)
logo_image = [Image placeholder]
background_image = [Image placeholder]  
hero_image = [Image placeholder]
```

### Step 1.5: Component Publishing

**CRITICAL: Publish all components to Team Library**
1. Select all component sets
2. Click "Publish" 
3. Add description: "Windows Ad Kit Templates v1.0"
4. **Record Component IDs** - you'll need these for the API

## Phase 2: Environment Configuration

### Step 2.1: Update Environment Variables

**Add to `.env.local`:**
```env
# Real Figma Configuration
FIGMA_ACCESS_TOKEN="[YOUR_PERSONAL_ACCESS_TOKEN]"
FIGMA_TEAM_ID="[YOUR_TEAM_ID]"
FIGMA_TEMPLATE_FILE_KEY="[TEMPLATE_FILE_KEY_FROM_URL]"

# Component IDs (get these from Figma)
FIGMA_FINANCING_1x1_ID="[COMPONENT_ID]"
FIGMA_FINANCING_16x9_ID="[COMPONENT_ID]"
FIGMA_FINANCING_4x5_ID="[COMPONENT_ID]"
FIGMA_FINANCING_9x16_ID="[COMPONENT_ID]"
# ... repeat for all components
```

### Step 2.2: Get Required IDs

**How to get Figma File Key:**
```
From URL: https://www.figma.com/file/ABC123DEF456/Windows-Ad-Kit
File Key = "ABC123DEF456"
```

**How to get Component IDs:**
1. Right-click component in Figma
2. "Copy link"  
3. Extract ID from URL: `node-id=123%3A456` → Component ID = "123:456"

**How to get Personal Access Token:**
1. Figma → Settings → Personal access tokens
2. Generate new token with "File content" scope
3. **SECURE THIS TOKEN** - treat like a password

## Phase 3: API Implementation

### Step 3.1: Replace Mock Service

**Replace the import in all API files:**

```typescript
// OLD (mock)
import { figmaService } from '@/lib/figma'

// NEW (real)  
import { realFigmaService as figmaService } from '@/lib/figma-real'
```

### Step 3.2: Add Component ID Mapping

**Create component lookup service:**

```typescript
// src/lib/figma-components.ts
export const COMPONENT_IDS = {
  financing: {
    '1x1': process.env.FIGMA_FINANCING_1x1_ID!,
    '16x9': process.env.FIGMA_FINANCING_16x9_ID!,
    '4x5': process.env.FIGMA_FINANCING_4x5_ID!,
    '9x16': process.env.FIGMA_FINANCING_9x16_ID!,
  },
  energy: {
    '1x1': process.env.FIGMA_ENERGY_1x1_ID!,
    '16x9': process.env.FIGMA_ENERGY_16x9_ID!,
    '4x5': process.env.FIGMA_ENERGY_4x5_ID!,
    '9x16': process.env.FIGMA_ENERGY_9x16_ID!,
  },
  // ... etc
}

export function getComponentId(angle: string, size: string): string {
  const angleMap = COMPONENT_IDS[angle as keyof typeof COMPONENT_IDS]
  if (!angleMap) throw new Error(`Unknown angle: ${angle}`)
  
  const componentId = angleMap[size as keyof typeof angleMap]
  if (!componentId) throw new Error(`Unknown size for ${angle}: ${size}`)
  
  return componentId
}
```

## Phase 4: Logo Processing System

### Step 4.1: Background Removal Service

**Install remove.bg or similar:**
```bash
npm install @remove-bg/api
```

**Create logo processing service:**
```typescript
// src/lib/logo-processor.ts
import { RemoveBgApi } from '@remove-bg/api'

const removeBg = new RemoveBgApi(process.env.REMOVE_BG_API_KEY!)

export async function processLogo(logoUrl: string): Promise<string> {
  try {
    // Download original
    const response = await fetch(logoUrl)
    const buffer = await response.arrayBuffer()
    
    // Remove background
    const result = await removeBg.removeBackgroundFromImageBuffer(buffer, {
      size: 'regular',
      type: 'auto',
    })
    
    // Upload to your CDN/storage
    const processedUrl = await uploadProcessedImage(result)
    return processedUrl
    
  } catch (error) {
    console.error('Logo processing failed:', error)
    return logoUrl // Fallback to original
  }
}
```

## Phase 5: Testing Strategy

### Step 5.1: Component Testing

**Test each component individually:**
```bash
# Test component access
curl -H "X-Figma-Token: YOUR_TOKEN" \
  "https://api.figma.com/v1/files/YOUR_FILE_KEY/components"

# Test variable updates  
curl -X POST -H "X-Figma-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"variables": {"headline_text": "Test Headline"}}' \
  "https://api.figma.com/v1/files/YOUR_FILE_KEY/variables"
```

### Step 5.2: End-to-End Testing

**Create test campaign:**
```typescript
// Test with real data
const testResult = await figmaService.generateCompleteAdSet({
  businessName: "Test Windows Co",
  city: "Austin", 
  phone: "(512) 555-0123",
  logoUrl: "https://example.com/logo.png",
  colors: { primary: "#0066CC", secondary: "#333333" },
  angles: ["financing"],
  campaignId: "test_001"
})

console.log('Generated ads:', testResult.ads)
```

## Phase 6: Error Handling & Fallbacks

### Step 6.1: API Rate Limiting

**Implement queue system:**
```typescript
// src/lib/figma-queue.ts
export class FigmaRequestQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private readonly RATE_LIMIT = 200 // ms between requests

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      this.process()
    })
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const request = this.queue.shift()!
      await request()
      await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT))
    }
    
    this.processing = false
  }
}
```

### Step 6.2: Fallback System

**Graceful degradation:**
```typescript
export async function generateAdWithFallback(options: any) {
  try {
    // Try real Figma generation
    return await realFigmaService.generateCompleteAdSet(options)
  } catch (error) {
    console.error('Real Figma failed, using fallback:', error)
    
    // Fall back to mock generation
    return await mockFigmaService.generateCompleteAdSet(options)
  }
}
```

## Phase 7: Production Deployment

### Step 7.1: Environment Setup

**Production environment variables:**
```env
FIGMA_ACCESS_TOKEN="[PRODUCTION_TOKEN]"
FIGMA_TEMPLATE_FILE_KEY="[PRODUCTION_FILE_KEY]"
REMOVE_BG_API_KEY="[PRODUCTION_KEY]"
CDN_UPLOAD_ENDPOINT="[YOUR_CDN]"
```

### Step 7.2: Monitoring

**Add monitoring for:**
- Figma API response times
- Image generation success rates  
- Component availability
- Export URL validity

### Step 7.3: Customer Testing

**Beta test with real customers:**
1. Select 5 existing customers
2. Generate real ads using their data
3. Validate output quality
4. Gather feedback on accuracy
5. Iterate on template design

## 🚨 CRITICAL SUCCESS FACTORS

### 1. Template Quality is Everything
- **Pixel-perfect layouts** for each aspect ratio
- **Consistent branding** across all variants
- **Readable text** at all sizes
- **Professional imagery** placement

### 2. Component Variable Mapping
- **Every text element** must be a variable
- **All colors** must be configurable  
- **Image slots** must accept uploads
- **Boolean controls** for optional elements

### 3. Error Handling
- **API failures** → fallback to mock
- **Rate limits** → queue management
- **Invalid data** → sensible defaults
- **Export errors** → retry logic

### 4. Performance Optimization
- **Image compression** before upload
- **Concurrent generation** where possible
- **CDN delivery** for final assets
- **Caching** of repeated requests

## 📊 Success Metrics

**Technical Metrics:**
- API success rate > 95%
- Average generation time < 30 seconds per ad
- Export URL validity > 99%
- Customer approval rate > 85%

**Business Metrics:** 
- Real ads generated (not mocks)
- Customer download completion rate
- Campaign deployment success
- Revenue from real creative delivery

---

## ⚡ IMPLEMENTATION PRIORITY

**Week 1:** Figma template creation and component setup
**Week 2:** Real API integration and testing
**Week 3:** Logo processing and error handling  
**Week 4:** Production deployment and customer testing

**This transforms Windows Ad Kit from a mock system to a real creative automation platform that generates actual, deployable advertising campaigns.**