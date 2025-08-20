import { NextRequest, NextResponse } from 'next/server'
import { figmaService, type GenerateAdOptions } from '@/lib/figma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      // Brand Kit
      logoUrl,
      primaryColor,
      secondaryColor,
      
      // Business Data
      businessName,
      city,
      phone,
      serviceArea,
      offer,
      price,
      cta,
      legal,
      
      // Campaign Settings
      selectedAngles,
      selectedSizes,
      figmaFileKey,
    } = data

    // Validate required fields
    if (!businessName || !city || !phone || !selectedAngles?.length || !selectedSizes?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('🎨 Starting real creative generation with Figma API...')
    
    const generatedAds = []
    const errors = []
    
    // Generate ads for each angle and size combination
    for (const angle of selectedAngles) {
      for (const size of selectedSizes) {
        try {
          const adOptions: GenerateAdOptions = {
            businessName,
            city,
            phone,
            logoUrl,
            primaryColor,
            secondaryColor,
            angle,
            size,
            customText: {
              offer,
              price,
              cta,
              legal,
            },
          }

          console.log(`Generating ad: ${angle} - ${size}`)
          
          // Create ad instance with real Figma API
          const adInstance = await figmaService.createAdInstance(adOptions)
          
          // Generate preview for quality assurance
          const preview = await figmaService.generatePreview(adOptions)
          
          // Validate ad quality
          const validation = await figmaService.validateAdQuality(adInstance.nodeId)
          
          const generatedAd = {
            id: `wnd_${angle}_${size}_v1`,
            angle,
            size,
            nodeId: adInstance.nodeId,
            componentKey: adInstance.componentSetId,
            variables: adInstance.variables,
            previewUrl: preview.previewUrl,
            fullResUrl: preview.fullResUrl,
            validation,
            status: validation.isValid ? 'generated' : 'needs_review',
            created: new Date().toISOString(),
          }

          generatedAds.push(generatedAd)
          
          console.log(`✅ Generated: ${angle} - ${size}`)
          
        } catch (error) {
          console.error(`❌ Failed to generate ${angle} - ${size}:`, error)
          errors.push({
            angle,
            size,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }

    // Return results
    const response = {
      success: generatedAds.length > 0,
      ads: generatedAds,
      totalAds: generatedAds.length,
      errors,
      message: errors.length === 0 
        ? `Successfully generated ${generatedAds.length} ad variations`
        : `Generated ${generatedAds.length} ads with ${errors.length} errors`,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Ad generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate ads',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

