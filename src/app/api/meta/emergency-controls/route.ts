import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Emergency campaign controls - pause, resume, adjust budget
export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, campaignId, newBudget } = await request.json()

    if (!sessionId || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Get customer and Meta connection
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
          ad_account_id
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
        { error: 'Meta connection not active' },
        { status: 400 }
      )
    }

    const accessToken = metaConnection.access_token
    let targetCampaign = customer.meta_campaigns?.[0]

    // If specific campaign ID provided, find it
    if (campaignId) {
      targetCampaign = customer.meta_campaigns?.find(c => c.meta_campaign_id === campaignId)
    }

    if (!targetCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    console.log(`🚨 Emergency control action: ${action} for campaign ${targetCampaign.meta_campaign_id}`)

    let result: any = {}
    let newStatus = targetCampaign.status

    switch (action) {
      case 'pause':
        // Pause campaign immediately
        const pauseResponse = await fetch(`https://graph.facebook.com/v18.0/${targetCampaign.meta_campaign_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            status: 'PAUSED'
          })
        })

        if (!pauseResponse.ok) {
          const error = await pauseResponse.json()
          throw new Error(error.error?.message || 'Failed to pause campaign')
        }

        newStatus = 'PAUSED'
        result = { campaignId: targetCampaign.meta_campaign_id, status: 'PAUSED' }
        console.log('✅ Campaign paused successfully')
        break

      case 'resume':
        // Resume campaign
        const resumeResponse = await fetch(`https://graph.facebook.com/v18.0/${targetCampaign.meta_campaign_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            status: 'ACTIVE'
          })
        })

        if (!resumeResponse.ok) {
          const error = await resumeResponse.json()
          throw new Error(error.error?.message || 'Failed to resume campaign')
        }

        newStatus = 'ACTIVE'
        result = { campaignId: targetCampaign.meta_campaign_id, status: 'ACTIVE' }
        console.log('✅ Campaign resumed successfully')
        break

      case 'adjust_budget':
        if (!newBudget || newBudget < 25) {
          return NextResponse.json(
            { error: 'Valid budget required (minimum $25)' },
            { status: 400 }
          )
        }

        // Update campaign budget
        const budgetResponse = await fetch(`https://graph.facebook.com/v18.0/${targetCampaign.meta_campaign_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            daily_budget: newBudget * 100 // Convert to cents
          })
        })

        if (!budgetResponse.ok) {
          const error = await budgetResponse.json()
          throw new Error(error.error?.message || 'Failed to update budget')
        }

        result = { 
          campaignId: targetCampaign.meta_campaign_id, 
          newBudget: newBudget,
          message: `Budget updated to $${newBudget}/day`
        }
        console.log(`✅ Budget updated to $${newBudget}/day`)
        break

      case 'emergency_stop':
        // Full emergency stop - pause and set budget to minimum
        const stopResponse = await fetch(`https://graph.facebook.com/v18.0/${targetCampaign.meta_campaign_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: accessToken,
            status: 'PAUSED',
            daily_budget: 2500 // $25 minimum
          })
        })

        if (!stopResponse.ok) {
          const error = await stopResponse.json()
          throw new Error(error.error?.message || 'Failed to emergency stop campaign')
        }

        newStatus = 'PAUSED'
        result = { 
          campaignId: targetCampaign.meta_campaign_id, 
          status: 'PAUSED',
          budget: 25,
          message: 'Emergency stop executed - campaign paused and budget reduced'
        }
        console.log('🚨 Emergency stop executed successfully')
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update database record
    await supabaseAdmin
      .from('meta_campaigns')
      .update({ 
        status: newStatus,
        daily_budget: action === 'adjust_budget' ? newBudget * 100 : 
                     action === 'emergency_stop' ? 2500 : 
                     targetCampaign.daily_budget,
        updated_at: new Date().toISOString()
      })
      .eq('meta_campaign_id', targetCampaign.meta_campaign_id)

    // Log the emergency action
    await supabaseAdmin
      .from('campaign_action_logs')
      .insert({
        customer_id: customer.id,
        meta_campaign_id: targetCampaign.id,
        action_type: action,
        action_data: {
          previous_status: targetCampaign.status,
          new_status: newStatus,
          previous_budget: targetCampaign.daily_budget,
          new_budget: action === 'adjust_budget' ? newBudget * 100 : 
                     action === 'emergency_stop' ? 2500 : 
                     targetCampaign.daily_budget,
          timestamp: new Date().toISOString()
        },
        performed_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      action: action,
      result: result,
      message: `Campaign ${action} completed successfully`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Emergency control error:', error)
    return NextResponse.json(
      { 
        error: 'Emergency control failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get campaign status and recent actions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Get customer campaigns and recent actions
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select(`
        id,
        businessName,
        meta_campaigns (
          id,
          meta_campaign_id,
          campaign_name,
          status,
          daily_budget,
          created_at,
          updated_at
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

    // Get recent action logs
    const { data: actionLogs } = await supabaseAdmin
      .from('campaign_action_logs')
      .select('*')
      .eq('customer_id', customer.id)
      .order('performed_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      success: true,
      campaigns: customer.meta_campaigns || [],
      recentActions: actionLogs || [],
      emergencyControlsAvailable: true
    })

  } catch (error) {
    console.error('Error fetching emergency controls data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emergency controls data' },
      { status: 500 }
    )
  }
}