import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Intelligent angle selection based on business intelligence
function generateStrategicAngles(businessIntel: any, customer: any) {
  const baseAngles = [
    {
      id: 'financing',
      name: 'Financing Focus',
      priority: getFinancingPriority(businessIntel),
      messaging: generateFinancingMessage(businessIntel, customer)
    },
    {
      id: 'energy_rebate',
      name: 'Energy Efficiency',
      priority: getEnergyPriority(businessIntel),
      messaging: generateEnergyMessage(businessIntel, customer)
    },
    {
      id: 'fast_install',
      name: 'Quick Installation',
      priority: getSpeedPriority(businessIntel),
      messaging: generateSpeedMessage(businessIntel, customer)
    },
    {
      id: 'trust_authority',
      name: 'Trust & Experience',
      priority: getTrustPriority(businessIntel),
      messaging: generateTrustMessage(businessIntel, customer)
    }
  ]

  // Sort by priority and return top 3 angles
  return baseAngles
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
}

function getFinancingPriority(businessIntel: any): number {
  let score = 50 // base score
  
  if (businessIntel.avgProjectValue >= '8000') score += 30
  if (businessIntel.biggestChallenge === 'pricing_competition') score += 20
  if (businessIntel.previousAdSpend === 'none') score += 15 // New advertisers need financing hook
  
  return Math.min(score, 100)
}

function getEnergyPriority(businessIntel: any): number {
  let score = 40 // base score
  
  if (businessIntel.businessType === 'windows_only') score += 25
  if (businessIntel.busySeason === 'year_round') score += 15
  if (businessIntel.uniqueAdvantage?.toLowerCase().includes('energy')) score += 20
  
  return Math.min(score, 100)
}

function getSpeedPriority(businessIntel: any): number {
  let score = 35 // base score
  
  if (businessIntel.biggestChallenge === 'seasonal_gaps') score += 25
  if (businessIntel.uniqueAdvantage?.toLowerCase().includes('fast') || 
      businessIntel.uniqueAdvantage?.toLowerCase().includes('quick')) score += 30
  if (businessIntel.conversionGoal === 'appointments') score += 15
  
  return Math.min(score, 100)
}

function getTrustPriority(businessIntel: any): number {
  let score = 45 // base score
  
  if (businessIntel.yearsInBusiness === '10_plus') score += 30
  if (businessIntel.uniqueAdvantage?.toLowerCase().includes('family') ||
      businessIntel.uniqueAdvantage?.toLowerCase().includes('warranty')) score += 25
  if (businessIntel.biggestChallenge === 'lead_quality') score += 20
  
  return Math.min(score, 100)
}

function generateFinancingMessage(businessIntel: any, customer: any): string {
  const baseMessage = `New Windows in ${customer.city} - No Money Down!`
  const avgProject = businessIntel.avgProjectValue
  
  if (avgProject >= '12000') {
    return `Premium Windows in ${customer.city} - $0 Down, Low Monthly Payments!`
  } else if (avgProject >= '8000') {
    return `${baseMessage} As Low as $99/Month!`
  }
  return baseMessage
}

function generateEnergyMessage(businessIntel: any, customer: any): string {
  const base = `Save $1,000+ Yearly on Energy Bills in ${customer.city}`
  
  if (businessIntel.uniqueAdvantage?.toLowerCase().includes('energy')) {
    return `${customer.city} Energy Experts - Cut Your Bills in Half!`
  }
  return base
}

function generateSpeedMessage(businessIntel: any, customer: any): string {
  if (businessIntel.uniqueAdvantage?.toLowerCase().includes('fast') ||
      businessIntel.uniqueAdvantage?.toLowerCase().includes('quick')) {
    return `Same-Day Windows Quote in ${customer.city} - Installed This Week!`
  }
  return `New Windows Installed in ${customer.city} - Quick & Professional!`
}

function generateTrustMessage(businessIntel: any, customer: any): string {
  const years = businessIntel.yearsInBusiness
  
  if (years === '10_plus') {
    return `${customer.city}'s Most Trusted Window Company - 10+ Years Experience`
  } else if (businessIntel.uniqueAdvantage?.toLowerCase().includes('family')) {
    return `Family-Owned Window Experts Serving ${customer.city}`
  } else if (businessIntel.uniqueAdvantage?.toLowerCase().includes('warranty')) {
    return `Lifetime Warranty on All Windows - ${customer.city} Contractor`
  }
  return `Top-Rated Window Contractor in ${customer.city}`
}

function generateAdVariations(angles: any[]) {
  const variations = []
  const sizes = ['1x1', '9x16', '16x9', '4x5'] // Including Instagram Reel size
  
  angles.forEach((angle) => {
    sizes.forEach((size) => {
      variations.push({
        key: `meta_${angle.id}_${size}_v1`,
        angle: angle.id,
        angleName: angle.name,
        size: size,
        messaging: angle.messaging
      })
    })
  })
  
  return variations
}

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json()

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    console.log('🎨 Starting ad generation for campaign:', campaignId)

    // Get campaign details
    const { data: campaign } = await supabaseAdmin
      .from('campaigns')
      .select('*, customers(*)')
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Get campaign details including business intelligence
    const businessIntel = campaign.business_intel || {}
    
    // Generate strategic angles based on business intelligence
    const selectedAngles = generateStrategicAngles(businessIntel, campaign.customers)
    
    // Create figma_package with complete structure matching my-campaign expectations
    const figmaPackage = {
      campaignId: campaign.id,
      customerId: campaign.customer_id,
      strategicAngles: selectedAngles,
      completeOnboardingData: {
        businessIntelligence: businessIntel
      },
      businessData: {
        name: campaign.customers.business_name,
        city: campaign.customers.city,
        phone: campaign.customers.phone || '(555) 123-4567',
        color: '#ff6b6b',
        uniqueAdvantage: businessIntel.uniqueAdvantage || '',
        businessType: businessIntel.businessType || 'windows_only'
      },
      templateData: {
        strategicAngles: selectedAngles,
        components: generateAdVariations(selectedAngles)
      }
    }

    // For demo purposes, create a mock job ID and start generation
    const mockJobId = `job_${campaignId}_${Date.now()}`
    console.log('✅ Mock figma job created:', mockJobId)

    // Start the new asset delivery pipeline instead of mock generation
    console.log('🏭 Starting real asset delivery pipeline...')
    
    const pipelineResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/assets/pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        customerId: campaign.customer_id,
        businessIntel: businessIntel,
        priority: 'normal'
      })
    })

    if (!pipelineResponse.ok) {
      // Fallback to mock generation if pipeline fails
      console.warn('Pipeline failed, using fallback generation')
      startAdGeneration(mockJobId, campaignId, figmaPackage)
      
      return NextResponse.json({
        success: true,
        jobId: mockJobId,
        message: 'Ad generation started (fallback mode)',
        estimatedTime: '2-10 minutes',
        mode: 'fallback'
      })
    }

    const pipelineData = await pipelineResponse.json()

    return NextResponse.json({
      success: true,
      jobId: pipelineData.jobId,
      pipelineJobId: pipelineData.jobId,
      message: 'Real creative generation pipeline started',
      estimatedTime: '5-15 minutes',
      mode: 'production',
      stages: pipelineData.stages
    })

  } catch (error) {
    console.error('Generate ads error:', error)
    return NextResponse.json(
      { error: 'Failed to start ad generation' },
      { status: 500 }
    )
  }
}

// In-memory storage for demo (in production, this would be in database)
const jobStorage: any = {}

// Background process to simulate ad generation
async function startAdGeneration(jobId: string, campaignId: string, figmaPackage?: any) {
  // Initialize job in memory
  jobStorage[jobId] = {
    id: jobId,
    campaignId: campaignId,
    status: 'processing',
    progress: 0,
    stage: 1,
    message: 'Processing business data...',
    outputUrls: [],
    figma_package: figmaPackage,
    createdAt: new Date().toISOString(),
    completedAt: null
  }
  const stages = [
    { stage: 1, percent: 20, message: 'Processing business data...', duration: 10000 }, // 10 seconds
    { stage: 2, percent: 40, message: 'Preparing logo and branding...', duration: 15000 }, // 15 seconds  
    { stage: 3, percent: 70, message: 'Generating ad variations...', duration: 20000 }, // 20 seconds
    { stage: 4, percent: 90, message: 'Optimizing for platforms...', duration: 10000 }, // 10 seconds
    { stage: 5, percent: 100, message: 'Finalizing downloads...', duration: 5000 } // 5 seconds
  ]

  for (const stageInfo of stages) {
    // Wait for the stage duration
    await new Promise(resolve => setTimeout(resolve, stageInfo.duration))

    try {
      // Update progress in memory
      if (jobStorage[jobId]) {
        jobStorage[jobId].stage = stageInfo.stage
        jobStorage[jobId].progress = stageInfo.percent
        jobStorage[jobId].message = stageInfo.message
      }

      console.log(`📈 Stage ${stageInfo.stage} completed: ${stageInfo.percent}%`)
    } catch (error) {
      console.error(`Error updating stage ${stageInfo.stage}:`, error)
    }
  }

  // Generate 12 mock Meta ad URLs
  const mockAdUrls = [
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/financing-1x1.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/financing-9x16.png', 
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/financing-16x9.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/energy-rebate-1x1.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/energy-rebate-9x16.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/energy-rebate-16x9.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/fast-install-1x1.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/fast-install-9x16.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/fast-install-16x9.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/limited-time-1x1.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/limited-time-9x16.png',
    'https://windows-ad-kit.s3.amazonaws.com/meta-ads/limited-time-16x9.png'
  ]

  try {
    // Mark as completed in memory
    if (jobStorage[jobId]) {
      jobStorage[jobId].status = 'completed'
      jobStorage[jobId].progress = 100
      jobStorage[jobId].stage = 5
      jobStorage[jobId].message = 'Ready for download!'
      jobStorage[jobId].outputUrls = mockAdUrls
      jobStorage[jobId].completedAt = new Date().toISOString()
    }

    console.log('🎉 Ad generation completed for job:', jobId)
  } catch (error) {
    console.error('Error completing ad generation:', error)
  }
}

// GET endpoint to check generation progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const campaignId = searchParams.get('campaignId')

    if (!jobId && !campaignId) {
      return NextResponse.json({ error: 'Job ID or Campaign ID required' }, { status: 400 })
    }

    // First, try to find job in new asset pipeline
    if (jobId?.startsWith('pipeline_') || campaignId) {
      try {
        const pipelineResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/assets/pipeline?${
            jobId ? `jobId=${jobId}` : `campaignId=${campaignId}`
          }`
        )

        if (pipelineResponse.ok) {
          const pipelineData = await pipelineResponse.json()
          
          // Transform pipeline response to match expected format
          return NextResponse.json({
            success: true,
            job: {
              id: pipelineData.job.id,
              status: pipelineData.job.status,
              progress: pipelineData.job.progress,
              stage: pipelineData.job.stage,
              message: pipelineData.job.stage,
              outputUrls: pipelineData.job.assets?.map((a: any) => a.downloadUrl) || [],
              assets: pipelineData.job.assets,
              figma_package: null,
              createdAt: pipelineData.job.created,
              completedAt: pipelineData.job.completed,
              mode: 'production',
              canDownload: pipelineData.job.canDownload,
              requiresReview: pipelineData.job.requiresReview,
              qualityReport: pipelineData.job.qualityReport
            }
          })
        }
      } catch (pipelineError) {
        console.log('Pipeline check failed, trying fallback storage')
      }
    }

    // Fallback to legacy job storage
    let job = null
    
    if (jobId) {
      job = jobStorage[jobId]
    } else if (campaignId) {
      // Find job by campaignId
      job = Object.values(jobStorage).find((j: any) => j.campaignId === campaignId)
    }

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        stage: job.stage,
        message: job.message,
        outputUrls: job.outputUrls || [],
        figma_package: job.figma_package,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        mode: 'fallback'
      }
    })

  } catch (error) {
    console.error('Get generation status error:', error)
    return NextResponse.json(
      { error: 'Failed to get generation status' },
      { status: 500 }
    )
  }
}