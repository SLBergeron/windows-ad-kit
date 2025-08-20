import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    )
  }

  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not configured')
    return NextResponse.json(
      { error: 'Database connection not available' },
      { status: 500 }
    )
  }

  try {
    console.log('🔍 Fetching customer data for session:', sessionId)

    // Keep only basic test session for development
    if (sessionId === 'test_session') {
      console.log('✅ Returning mock customer data for basic test session')
      const mockCustomer = {
        id: 'test_customer_123',
        businessName: 'Test Windows Co',
        city: 'Austin',
        email: 'test@example.com',
        createdAt: new Date().toISOString()
      }
      
      const mockCampaign = {
        id: 'test_campaign_123',
        name: 'Winter Special',
        type: 'winter_special',
        status: 'draft',
        budget: 1500,
        appointmentsBooked: 0,
        costPerAppointment: 47,
        revenueGenerated: 0,
        launchesAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        hoursUntilLaunch: 24
      }

      return NextResponse.json({
        success: true,
        customer: mockCustomer,
        campaign: mockCampaign,
        sessionId
      })
    }

    // Fetch customer with their campaigns
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select(`
        id,
        business_name,
        city,
        email,
        created_at,
        campaigns (
          id,
          name,
          type,
          status,
          budget,
          appointments_booked,
          cost_per_appointment,
          revenue_generated,
          launches_at,
          created_at
        )
      `)
      .eq('stripe_session_id', sessionId)
      .single()

    if (customerError) {
      if (customerError.code === 'PGRST116') {
        console.log('⚠️ Customer not found for session:', sessionId)
        return NextResponse.json(
          { error: 'Customer not found', sessionId },
          { status: 404 }
        )
      }
      throw customerError
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found', sessionId },
        { status: 404 }
      )
    }

    console.log('✅ Customer data fetched successfully:', {
      customerId: customer.id,
      businessName: customer.business_name
    })

    // Calculate time until campaign launch
    const campaign = customer.campaigns?.[0]
    let hoursUntilLaunch = null
    let campaignStatus = 'No campaign'

    if (campaign) {
      const launchTime = new Date(campaign.launches_at)
      const now = new Date()
      const diffMs = launchTime.getTime() - now.getTime()
      hoursUntilLaunch = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)))
      campaignStatus = campaign.status
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        businessName: customer.business_name,
        city: customer.city,
        email: customer.email,
        createdAt: customer.created_at
      },
      campaign: campaign ? {
        id: campaign.id,
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
        budget: campaign.budget,
        appointmentsBooked: campaign.appointments_booked,
        costPerAppointment: campaign.cost_per_appointment,
        revenueGenerated: campaign.revenue_generated,
        launchesAt: campaign.launches_at,
        hoursUntilLaunch
      } : null,
      sessionId
    })

  } catch (error) {
    console.error('❌ Error fetching customer data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch customer data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}