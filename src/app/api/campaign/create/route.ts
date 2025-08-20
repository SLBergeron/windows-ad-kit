import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// AI Strategic Angle Selection Algorithm
function generateStrategicAngles(businessIntel: any) {
  const angles = []
  
  // Analysis based on business intelligence
  const { businessType, yearsInBusiness, biggestChallenge, previousAdSpend, uniqueAdvantage } = businessIntel
  
  // Angle 1: Financial/Financing Focus
  if (biggestChallenge === 'pricing_competition' || previousAdSpend === 'none' || previousAdSpend === 'under_1000') {
    angles.push({
      angle: 'financing',
      title: 'Financing Focus',
      reasoning: 'Address price concerns with flexible payment options',
      messageVariation: uniqueAdvantage ? `${uniqueAdvantage} + No money down` : 'No money down, easy monthly payments'
    })
  }
  
  // Angle 2: Trust & Authority 
  if (yearsInBusiness === '10_plus' || uniqueAdvantage.toLowerCase().includes('family') || uniqueAdvantage.toLowerCase().includes('years')) {
    angles.push({
      angle: 'trust_authority',
      title: 'Trust & Authority',
      reasoning: 'Leverage your experience and reputation for higher lead quality',
      messageVariation: yearsInBusiness === '10_plus' ? 'Trusted local experts for over 10 years' : uniqueAdvantage || 'Licensed & insured professionals'
    })
  }
  
  // Angle 3: Energy Efficiency (high-performing for windows)
  if (businessType === 'windows_only' || businessType === 'full_exterior') {
    angles.push({
      angle: 'energy_efficiency',
      title: 'Energy Efficiency',
      reasoning: 'High-converting angle for window contractors - addresses utility costs',
      messageVariation: 'Cut your energy bills in half with premium windows'
    })
  }
  
  // Angle 4: Speed/Convenience (especially for busy contractors)
  if (biggestChallenge === 'seasonal_gaps' || uniqueAdvantage.toLowerCase().includes('fast') || uniqueAdvantage.toLowerCase().includes('quick')) {
    angles.push({
      angle: 'fast_install',
      title: 'Fast Installation',
      reasoning: 'Address customer convenience concerns and seasonal urgency',
      messageVariation: uniqueAdvantage.toLowerCase().includes('fast') ? uniqueAdvantage : 'Professional installation in just 1 day'
    })
  }
  
  // Angle 5: Quality/Warranty (fallback for general contractors)
  if (businessType === 'general_contractor' || uniqueAdvantage.toLowerCase().includes('warranty') || uniqueAdvantage.toLowerCase().includes('lifetime')) {
    angles.push({
      angle: 'quality_warranty',
      title: 'Quality & Warranty',
      reasoning: 'Differentiate from cheaper competitors with quality focus',
      messageVariation: uniqueAdvantage.toLowerCase().includes('warranty') ? uniqueAdvantage : 'Premium quality with lifetime warranty'
    })
  }
  
  // Always ensure at least 3 angles - add defaults if needed
  if (angles.length < 3) {
    const defaults = [
      { angle: 'financing', title: 'Financing Focus', reasoning: 'Default high-converting angle', messageVariation: 'No money down, easy payments' },
      { angle: 'energy_efficiency', title: 'Energy Efficiency', reasoning: 'Universal appeal for homeowners', messageVariation: 'Save money on energy bills' },
      { angle: 'trust_authority', title: 'Local Experts', reasoning: 'Build credibility and trust', messageVariation: 'Licensed & insured local professionals' }
    ]
    
    defaults.forEach(defaultAngle => {
      if (!angles.find(a => a.angle === defaultAngle.angle)) {
        angles.push(defaultAngle)
      }
    })
  }
  
  // Return top 3 most relevant angles
  return angles.slice(0, 3)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, customer, campaignData, figmaData } = data

    if (!sessionId || !customer || !campaignData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    console.log('🎨 Creating campaign for customer:', customer.businessName)

    // Check if customer exists
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .single()

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Delete any existing draft campaigns for this customer
    await supabaseAdmin
      .from('campaigns')
      .delete()
      .eq('customer_id', existingCustomer.id)
      .eq('status', 'draft')

    // Generate AI-selected strategic angles based on business intelligence
    const businessIntel = {
      businessType: campaignData.businessType,
      yearsInBusiness: campaignData.yearsInBusiness,
      uniqueAdvantage: campaignData.uniqueAdvantage || '',
      currentMarketing: campaignData.currentMarketing,
      biggestChallenge: campaignData.biggestChallenge,
      idealCustomer: campaignData.idealCustomer,
      previousAdSpend: campaignData.previousAdSpend,
      conversionGoal: campaignData.conversionGoal
    }

    // Create the main campaign record with business intelligence
    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .insert({
        customer_id: existingCustomer.id,
        name: `${campaignData.businessName} Strategic Ads`,
        type: 'winter_special', // Use existing allowed type
        status: 'draft',
        budget: 0, // $295 one-time, no ongoing budget
        appointments_booked: 0,
        cost_per_appointment: 0,
        revenue_generated: 0,
        business_intel: businessIntel, // Store business intelligence for generate-ads API
      })
      .select()
      .single()

    if (campaignError) {
      console.error('❌ Error creating campaign:', campaignError)
      throw campaignError
    }

    console.log('✅ Campaign created successfully:', campaign.id)

    const strategicAngles = generateStrategicAngles(businessIntel)
    console.log('🎯 AI-selected strategic angles:', strategicAngles.map(a => a.title))

    console.log('✅ Strategic angles generated:', strategicAngles.length, 'angles')

    // TODO: Process logo upload and background removal
    if (campaignData.logo) {
      console.log('📁 Logo file detected, would process background removal here')
      // This would integrate with a background removal service like Remove.bg
      // or use an AI service to clean up the logo
    }

    // Package everything for Figma integration with AI-selected angles and complete business intelligence
    const figmaPackage = {
      campaignId: campaign.id,
      customerId: existingCustomer.id,
      businessData: {
        name: campaignData.businessName,
        city: campaignData.city,
        phone: campaignData.phone,
        color: campaignData.primaryColor,
      },
      // Store all business intelligence data in figma package
      completeOnboardingData: {
        businessInfo: {
          businessName: campaignData.businessName,
          city: campaignData.city,
          phone: campaignData.phone,
          website: campaignData.website
        },
        marketInfo: {
          serviceRadius: campaignData.serviceRadius,
          avgProjectValue: campaignData.avgProjectValue,
          busySeason: campaignData.busySeason
        },
        branding: {
          primaryColor: campaignData.primaryColor,
          logoUrl: campaignData.logoUrl
        },
        businessIntelligence: businessIntel
      },
      strategicAngles: strategicAngles,
      templateData: {
        // Dynamic component mappings based on AI-selected angles
        components: strategicAngles.flatMap(angle => [
          { key: `wnd_${angle.angle}_1x1_v1`, angle: angle.angle, size: '1x1', title: angle.title },
          { key: `wnd_${angle.angle}_9x16_v1`, angle: angle.angle, size: '9x16', title: angle.title },
          { key: `wnd_${angle.angle}_16x9_v1`, angle: angle.angle, size: '16x9', title: angle.title },
          { key: `wnd_${angle.angle}_4x5_v1`, angle: angle.angle, size: '4x5', title: angle.title },
        ]),
        variables: {
          v_city: campaignData.city,
          v_phone: campaignData.phone,
          v_business: campaignData.businessName,
          v_color: campaignData.primaryColor,
          v_offer: strategicAngles[0]?.messageVariation || `Premium Windows in ${campaignData.city}`,
          v_price: `Starting at $299/window`,
          v_cta: campaignData.conversionGoal === 'phone_calls' ? 'Call Now' : 'Get Free Quote',
          v_legal: 'Licensed & insured. Financing available.',
          v_unique: campaignData.uniqueAdvantage || 'Professional installation'
        },
        slots: {
          slot_headline: `${strategicAngles[0]?.title} - ${campaignData.city}`,
          slot_subhead: strategicAngles[0]?.messageVariation || 'Premium installation with lifetime warranty',
          slot_price: 'Starting at $299/window',
          slot_cta: campaignData.conversionGoal === 'phone_calls' ? 'Call Now' : 'Get Free Quote',
          slot_legal: 'Licensed & insured. Financing available.',
          slot_city: campaignData.city,
          slot_phone: campaignData.phone,
          slot_logo: campaignData.logoUrl || '',
          slot_photo: 'https://windows-ad-kit.s3.amazonaws.com/stock-photos/windows-install.jpg',
          slot_unique: campaignData.uniqueAdvantage || 'Professional installation'
        }
      }
    }

    // Store the Figma package for processing (if table exists)
    try {
      const { data: figmaJob, error: figmaJobError } = await supabaseAdmin
        .from('figma_jobs')
        .insert({
          campaign_id: campaign.id,
          status: 'pending',
          figma_package: figmaPackage,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()
        
      if (figmaJobError) {
        console.error('❌ Error creating figma job:', figmaJobError)
        throw figmaJobError
      }
      
      console.log('📦 Figma package created and queued for processing:', figmaJob.id)
    } catch (figmaError) {
      console.log('⚠️ Figma jobs table not available or error creating job:', figmaError)
      // For now, we'll return the figma package in the response instead
    }

    // TODO: Trigger actual Figma integration
    // This would call the Figma API to:
    // 1. Update component variables
    // 2. Replace logo in slot layers
    // 3. Export PNG files @2x
    // 4. Upload exported files to CDN
    // 5. Update campaign status to 'completed'

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      message: 'Campaign created successfully',
      figmaPackage,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    })

  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}

// Helper endpoint to check campaign status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    const { data: campaign } = await supabaseAdmin
      .from('campaigns')
      .select(`
        *,
        figma_jobs (*)
      `)
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      campaign,
      status: campaign.status,
      figmaJob: campaign.figma_jobs?.[0] || null,
    })

  } catch (error) {
    console.error('Get campaign error:', error)
    return NextResponse.json(
      { error: 'Failed to get campaign' },
      { status: 500 }
    )
  }
}