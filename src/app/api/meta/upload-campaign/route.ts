import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface MetaCampaignRequest {
  sessionId: string
  campaignData: {
    name: string
    budget: number // Daily budget in cents
    objective: 'CONVERSIONS' | 'LEAD_GENERATION' | 'REACH'
    targeting: {
      location: {
        country: string
        region?: string
        city?: string
        radius?: number
      }
      age_min: number
      age_max: number
      interests?: string[]
      behaviors?: string[]
    }
    adSets: Array<{
      name: string
      budget: number
      targeting: any
      ads: Array<{
        name: string
        creative: {
          title: string
          body: string
          call_to_action: string
          image_url: string
        }
      }>
    }>
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: MetaCampaignRequest = await request.json()
    const { sessionId, campaignData } = data

    if (!sessionId || !campaignData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    // Get customer and Meta connection
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select(`
        id,
        businessName,
        city,
        meta_connections (
          id,
          access_token,
          business_accounts,
          status
        )
      `)
      .eq('stripe_session_id', sessionId)
      .single()

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const metaConnection = customer.meta_connections?.[0]
    if (!metaConnection || metaConnection.status !== 'active') {
      return NextResponse.json(
        { error: 'Meta Business Manager not connected' },
        { status: 400 }
      )
    }

    const accessToken = metaConnection.access_token
    const businessAccounts = metaConnection.business_accounts

    if (!businessAccounts || businessAccounts.length === 0) {
      return NextResponse.json(
        { error: 'No business accounts available' },
        { status: 400 }
      )
    }

    // Use the first business account (or let user select in UI)
    const adAccountId = businessAccounts[0].id
    const businessId = businessAccounts[0].business_id || businessAccounts[0].id

    console.log('🚀 Creating Meta campaign for customer:', customer.businessName)
    console.log('📊 Campaign data:', {
      name: campaignData.name,
      budget: campaignData.budget,
      adSets: campaignData.adSets.length
    })

    // Step 1: Create Campaign
    const campaignResponse = await fetch(`https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        name: campaignData.name,
        objective: campaignData.objective,
        status: 'PAUSED', // Start paused for safety
        special_ad_categories: [], // Add if needed for housing/employment/credit
      })
    })

    const campaignResult = await campaignResponse.json()
    
    if (!campaignResponse.ok) {
      console.error('❌ Campaign creation failed:', campaignResult)
      throw new Error(campaignResult.error?.message || 'Failed to create campaign')
    }

    console.log('✅ Campaign created:', campaignResult.id)

    // Step 2: Create Ad Sets
    const adSetResults = []
    for (const adSetData of campaignData.adSets) {
      const adSetResponse = await fetch(`https://graph.facebook.com/v18.0/act_${adAccountId}/adsets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          name: adSetData.name,
          campaign_id: campaignResult.id,
          daily_budget: adSetData.budget,
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'CONVERSIONS',
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          targeting: adSetData.targeting,
          status: 'PAUSED'
        })
      })

      const adSetResult = await adSetResponse.json()
      
      if (!adSetResponse.ok) {
        console.error('❌ Ad Set creation failed:', adSetResult)
        throw new Error(adSetResult.error?.message || 'Failed to create ad set')
      }

      adSetResults.push(adSetResult)
      console.log('✅ Ad Set created:', adSetResult.id)

      // Step 3: Create Ads for this Ad Set
      const adResults = []
      for (const adData of adSetData.ads) {
        // First, create the ad creative
        const creativeResponse = await fetch(`https://graph.facebook.com/v18.0/act_${adAccountId}/adcreatives`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            name: `${adData.name} Creative`,
            object_story_spec: {
              page_id: businessAccounts[0].page_id || businessId,
              link_data: {
                call_to_action: {
                  type: adData.creative.call_to_action
                },
                description: adData.creative.body,
                link: `https://example.com/contact?utm_source=facebook&utm_campaign=${campaignResult.id}`,
                message: adData.creative.title,
                picture: adData.creative.image_url
              }
            }
          })
        })

        const creativeResult = await creativeResponse.json()
        
        if (!creativeResponse.ok) {
          console.error('❌ Creative creation failed:', creativeResult)
          throw new Error(creativeResult.error?.message || 'Failed to create creative')
        }

        console.log('✅ Creative created:', creativeResult.id)

        // Create the ad
        const adResponse = await fetch(`https://graph.facebook.com/v18.0/act_${adAccountId}/ads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            name: adData.name,
            adset_id: adSetResult.id,
            creative: {
              creative_id: creativeResult.id
            },
            status: 'PAUSED'
          })
        })

        const adResult = await adResponse.json()
        
        if (!adResponse.ok) {
          console.error('❌ Ad creation failed:', adResult)
          throw new Error(adResult.error?.message || 'Failed to create ad')
        }

        adResults.push(adResult)
        console.log('✅ Ad created:', adResult.id)
      }

      adSetResults[adSetResults.length - 1].ads = adResults
    }

    // Store campaign info in database
    const { data: dbCampaign, error: dbError } = await supabaseAdmin
      .from('meta_campaigns')
      .insert({
        customer_id: customer.id,
        meta_connection_id: metaConnection.id,
        meta_campaign_id: campaignResult.id,
        campaign_name: campaignData.name,
        objective: campaignData.objective,
        daily_budget: campaignData.budget,
        status: 'PAUSED',
        ad_account_id: adAccountId,
        business_id: businessId,
        campaign_structure: {
          campaign: campaignResult,
          adSets: adSetResults
        },
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database storage failed:', dbError)
      // Campaign was created in Meta but not stored in DB
      // Consider implementing cleanup or manual reconciliation
    }

    console.log('🎉 Campaign upload completed successfully!')

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaignResult.id,
        name: campaignData.name,
        status: 'PAUSED',
        adSets: adSetResults.length,
        totalAds: adSetResults.reduce((total, adSet) => total + (adSet.ads?.length || 0), 0)
      },
      meta: {
        campaignId: campaignResult.id,
        adAccountId: adAccountId,
        businessId: businessId
      },
      message: 'Campaign uploaded successfully to Meta Ads Manager',
      nextSteps: [
        'Review campaign settings in Meta Ads Manager',
        'Verify targeting and budget settings',
        'Activate campaign when ready to go live',
        'Monitor performance in first 24 hours'
      ]
    })

  } catch (error) {
    console.error('Meta campaign upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload campaign to Meta',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get campaign status and performance data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const campaignId = searchParams.get('campaign_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Get customer and Meta campaigns
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select(`
        id,
        businessName,
        meta_connections (
          id,
          access_token,
          status
        ),
        meta_campaigns (
          id,
          meta_campaign_id,
          campaign_name,
          status,
          daily_budget,
          created_at,
          campaign_structure
        )
      `)
      .eq('stripe_session_id', sessionId)
      .single()

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const metaConnection = customer.meta_connections?.[0]
    if (!metaConnection) {
      return NextResponse.json({
        success: true,
        connected: false,
        campaigns: []
      })
    }

    let campaigns = customer.meta_campaigns || []

    // If we have an active connection, fetch live data from Meta
    if (metaConnection.status === 'active' && metaConnection.access_token) {
      try {
        // Fetch campaign performance from Meta API
        const campaignIds = campaigns.map(c => c.meta_campaign_id).join(',')
        
        if (campaignIds) {
          const performanceResponse = await fetch(
            `https://graph.facebook.com/v18.0/?ids=${campaignIds}&fields=id,name,status,daily_budget,insights.date_preset(last_7_days){impressions,clicks,spend,conversions}&access_token=${metaConnection.access_token}`
          )

          if (performanceResponse.ok) {
            const performanceData = await performanceResponse.json()
            
            // Merge performance data with stored campaigns
            campaigns = campaigns.map(campaign => ({
              ...campaign,
              liveData: performanceData[campaign.meta_campaign_id] || null
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching live campaign data:', error)
        // Continue with stored data only
      }
    }

    return NextResponse.json({
      success: true,
      connected: metaConnection.status === 'active',
      campaigns: campaigns,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length
    })

  } catch (error) {
    console.error('Error fetching Meta campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign data' },
      { status: 500 }
    )
  }
}