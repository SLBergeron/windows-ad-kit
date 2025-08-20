import { NextRequest, NextResponse } from 'next/server'
import { figmaService } from '@/lib/figma'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Complete Asset Delivery Pipeline
 * From business intelligence → ad generation → quality assurance → customer delivery
 */

interface PipelineJob {
  id: string
  campaignId: string
  customerId: string
  status: 'queued' | 'processing' | 'quality_check' | 'customer_review' | 'approved' | 'delivered' | 'failed'
  stage: string
  progress: number
  assets: AssetDelivery[]
  qualityReport?: QualityReport
  customerFeedback?: CustomerFeedback
  created: string
  completed?: string
}

interface AssetDelivery {
  id: string
  nodeId: string
  angle: string
  size: string
  previewUrl: string
  downloadUrl: string
  status: 'generating' | 'ready' | 'approved' | 'delivered'
  qualityScore: number
  issues: string[]
  filename: string
}

interface QualityReport {
  overallScore: number
  passedChecks: string[]
  failedChecks: string[]
  recommendations: string[]
  reviewRequired: boolean
}

interface CustomerFeedback {
  rating: number
  approved: string[]
  rejected: string[]
  comments: string
  requestedChanges: string[]
}

// In-memory storage for pipeline jobs (in production, use database)
const pipelineJobs: Record<string, PipelineJob> = {}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { campaignId, customerId, businessIntel, priority = 'normal' } = data

    if (!campaignId || !customerId) {
      return NextResponse.json(
        { error: 'Campaign ID and Customer ID are required' },
        { status: 400 }
      )
    }

    console.log(`🏭 Starting asset delivery pipeline for campaign: ${campaignId}`)

    // Create pipeline job
    const jobId = `pipeline_${campaignId}_${Date.now()}`
    const job: PipelineJob = {
      id: jobId,
      campaignId,
      customerId,
      status: 'queued',
      stage: 'Initializing pipeline',
      progress: 0,
      assets: [],
      created: new Date().toISOString(),
    }

    pipelineJobs[jobId] = job

    // Start the pipeline process
    startAssetPipeline(jobId, campaignId, customerId, businessIntel, priority)

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Asset delivery pipeline started',
      estimatedTime: '5-15 minutes',
      stages: [
        'Business intelligence analysis',
        'Creative generation',
        'Logo processing',
        'Quality assurance',
        'Customer preview generation',
        'Final asset preparation',
        'Delivery package creation'
      ],
    })

  } catch (error) {
    console.error('Pipeline start error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to start asset pipeline',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const campaignId = searchParams.get('campaignId')

    if (!jobId && !campaignId) {
      return NextResponse.json(
        { error: 'Job ID or Campaign ID is required' },
        { status: 400 }
      )
    }

    // Find job
    let job = null
    if (jobId) {
      job = pipelineJobs[jobId]
    } else if (campaignId) {
      job = Object.values(pipelineJobs).find(j => j.campaignId === campaignId)
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Pipeline job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        canDownload: job.status === 'delivered' || job.status === 'approved',
        requiresReview: job.status === 'customer_review',
        hasIssues: job.qualityReport?.reviewRequired || false,
      },
    })

  } catch (error) {
    console.error('Pipeline status error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get pipeline status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function startAssetPipeline(
  jobId: string, 
  campaignId: string, 
  customerId: string, 
  businessIntel: any,
  priority: string
) {
  const job = pipelineJobs[jobId]
  if (!job) return

  try {
    // Stage 1: Business Intelligence Analysis
    updateJob(jobId, {
      status: 'processing',
      stage: 'Analyzing business intelligence data',
      progress: 10,
    })

    await delay(2000)

    // Get campaign and customer data
    const { data: campaign } = await supabaseAdmin
      .from('campaigns')
      .select('*, customers(*)')
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      throw new Error('Campaign not found')
    }

    const businessData = {
      businessName: campaign.customers.business_name,
      city: campaign.customers.city,
      phone: campaign.customers.phone,
      logoUrl: campaign.customers.logo_url,
      primaryColor: campaign.customers.primary_color,
    }

    // Stage 2: Strategic Angle Selection
    updateJob(jobId, {
      stage: 'Selecting strategic advertising angles',
      progress: 20,
    })

    await delay(3000)

    const strategicAngles = selectStrategicAngles(businessIntel || campaign.business_intel)
    const adSizes = ['1x1', '9x16', '16x9', '4x5'] // Standard social media sizes

    // Stage 3: Creative Generation
    updateJob(jobId, {
      stage: 'Generating creative variations',
      progress: 35,
    })

    const assets: AssetDelivery[] = []
    
    for (const angle of strategicAngles) {
      for (const size of adSizes) {
        try {
          // Generate ad with Figma API
          const adOptions = {
            ...businessData,
            angle: angle.id,
            size,
          }

          const adInstance = await figmaService.createAdInstance(adOptions)
          const preview = await figmaService.generatePreview(adOptions)
          const validation = await figmaService.validateAdQuality(adInstance.nodeId)

          const asset: AssetDelivery = {
            id: `asset_${angle.id}_${size}_${Date.now()}`,
            nodeId: adInstance.nodeId,
            angle: angle.id,
            size,
            previewUrl: preview.previewUrl,
            downloadUrl: preview.fullResUrl,
            status: validation.isValid ? 'ready' : 'generating',
            qualityScore: validation.isValid ? 85 : 65,
            issues: validation.issues,
            filename: `${businessData.businessName}-${angle.id}-${size}.png`.replace(/[^a-zA-Z0-9.-]/g, '-'),
          }

          assets.push(asset)
          
        } catch (error) {
          console.error(`Failed to generate ${angle.id} - ${size}:`, error)
        }
      }
    }

    // Stage 4: Logo Processing
    updateJob(jobId, {
      stage: 'Processing and optimizing logos',
      progress: 50,
      assets,
    })

    await delay(2000)

    // Process logos for each asset (already handled in figmaService.createAdInstance)

    // Stage 5: Quality Assurance
    updateJob(jobId, {
      stage: 'Running quality assurance checks',
      progress: 65,
    })

    await delay(3000)

    const qualityReport = await runQualityAssurance(assets)

    // Stage 6: Customer Preview Generation
    updateJob(jobId, {
      stage: 'Generating customer preview package',
      progress: 80,
      qualityReport,
    })

    await delay(2000)

    // Update asset statuses based on quality
    assets.forEach(asset => {
      if (asset.qualityScore >= 80) {
        asset.status = 'ready'
      }
    })

    // Stage 7: Final Package Preparation
    updateJob(jobId, {
      stage: 'Preparing final delivery package',
      progress: 95,
    })

    await delay(1000)

    // Determine if customer review is needed
    const needsReview = qualityReport.reviewRequired || assets.some(a => a.qualityScore < 80)
    const finalStatus = needsReview ? 'customer_review' : 'delivered'

    // Complete the pipeline
    updateJob(jobId, {
      status: finalStatus,
      stage: needsReview ? 'Ready for customer review' : 'Assets delivered successfully',
      progress: 100,
      completed: new Date().toISOString(),
    })

    console.log(`✅ Asset pipeline completed for campaign: ${campaignId}`)

  } catch (error) {
    console.error('Pipeline error:', error)
    updateJob(jobId, {
      status: 'failed',
      stage: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      progress: 0,
    })
  }
}

function updateJob(jobId: string, updates: Partial<PipelineJob>) {
  if (pipelineJobs[jobId]) {
    pipelineJobs[jobId] = { ...pipelineJobs[jobId], ...updates }
  }
}

function selectStrategicAngles(businessIntel: any) {
  // Strategic angle selection based on business intelligence
  return [
    { id: 'financing', priority: 90 },
    { id: 'energy_rebate', priority: 85 },
    { id: 'fast_install', priority: 75 },
  ]
}

async function runQualityAssurance(assets: AssetDelivery[]): Promise<QualityReport> {
  const passedChecks: string[] = []
  const failedChecks: string[] = []
  const recommendations: string[] = []

  // Quality checks
  const totalAssets = assets.length
  const readyAssets = assets.filter(a => a.status === 'ready').length
  const avgQualityScore = assets.reduce((sum, a) => sum + a.qualityScore, 0) / totalAssets

  if (readyAssets >= totalAssets * 0.8) {
    passedChecks.push('Asset generation success rate > 80%')
  } else {
    failedChecks.push('Too many failed asset generations')
    recommendations.push('Review template configuration and retry failed assets')
  }

  if (avgQualityScore >= 80) {
    passedChecks.push('Average quality score meets standards')
  } else {
    failedChecks.push('Quality score below threshold')
    recommendations.push('Manual review recommended for low-quality assets')
  }

  // Check for missing critical assets
  const hasSquareAd = assets.some(a => a.size === '1x1' && a.status === 'ready')
  const hasStoryAd = assets.some(a => a.size === '9x16' && a.status === 'ready')
  
  if (hasSquareAd && hasStoryAd) {
    passedChecks.push('Critical ad formats available')
  } else {
    failedChecks.push('Missing critical ad formats')
    recommendations.push('Ensure square and story formats are generated')
  }

  return {
    overallScore: Math.round(avgQualityScore),
    passedChecks,
    failedChecks,
    recommendations,
    reviewRequired: failedChecks.length > 0 || avgQualityScore < 75,
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}