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
    console.log('🔍 Fetching portal data for session:', sessionId)

    // Keep test session for basic development
    if (sessionId === 'test_session') {
      console.log('✅ Returning mock portal data for test session')
      return NextResponse.json({
        success: true,
        customer: {
          id: 'test_customer_123',
          businessName: 'Test Windows Co',
          city: 'Austin',
          email: 'test@example.com',
          createdAt: new Date().toISOString()
        },
        campaigns: [{
          id: 'test_campaign_123',
          name: 'Winter Special',
          type: 'winter_special',
          status: 'active',
          budget: 1500,
          appointmentsBooked: 5,
          costPerAppointment: 47,
          revenueGenerated: 8500,
          launchesAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          hoursUntilLaunch: 0
        }],
        appointments: [
          {
            id: 'test_apt_1',
            leadName: 'John Smith',
            leadEmail: 'john@example.com',
            leadPhone: '(512) 555-0123',
            appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            appointmentType: 'estimate',
            status: 'scheduled',
            estimatedValue: 2500,
            campaignName: 'Winter Special'
          },
          {
            id: 'test_apt_2',
            leadName: 'Sarah Johnson',
            leadEmail: 'sarah@example.com',
            leadPhone: '(512) 555-0456',
            appointmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            appointmentType: 'consultation',
            status: 'completed',
            estimatedValue: 1800,
            actualValue: 1950,
            campaignName: 'Winter Special'
          }
        ],
        sessionId
      })
    }

    // Fetch customer with their campaigns and appointments
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
        ),
        appointments (
          id,
          lead_name,
          lead_email,
          lead_phone,
          appointment_date,
          appointment_type,
          status,
          estimated_value,
          actual_value,
          notes,
          campaign_id
        )
      `)
      .eq('stripe_session_id', sessionId)
      .single()

    if (customerError) {
      if (customerError.code === 'PGRST116') {
        console.log('⚠️ Customer not found for session:', sessionId)
        return NextResponse.json(
          { error: 'Customer not found. Please check your purchase confirmation email.' },
          { status: 404 }
        )
      }
      throw customerError
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found. Please check your purchase confirmation email.' },
        { status: 404 }
      )
    }

    console.log('✅ Portal data fetched successfully:', {
      customerId: customer.id,
      businessName: customer.business_name,
      campaignsCount: customer.campaigns?.length || 0,
      appointmentsCount: customer.appointments?.length || 0
    })

    // Transform campaigns data
    const campaigns = (customer.campaigns || []).map(campaign => {
      const launchTime = new Date(campaign.launches_at)
      const now = new Date()
      const diffMs = launchTime.getTime() - now.getTime()
      const hoursUntilLaunch = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)))

      return {
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
      }
    })

    // Transform appointments data (get campaign names)
    const campaignMap = new Map(campaigns.map(c => [c.id, c.name]))
    const appointments = (customer.appointments || []).map(appointment => ({
      id: appointment.id,
      leadName: appointment.lead_name,
      leadEmail: appointment.lead_email,
      leadPhone: appointment.lead_phone,
      appointmentDate: appointment.appointment_date,
      appointmentType: appointment.appointment_type,
      status: appointment.status,
      estimatedValue: appointment.estimated_value,
      actualValue: appointment.actual_value,
      notes: appointment.notes,
      campaignName: campaignMap.get(appointment.campaign_id) || 'Unknown Campaign'
    }))

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        businessName: customer.business_name,
        city: customer.city,
        email: customer.email,
        createdAt: customer.created_at
      },
      campaigns,
      appointments,
      sessionId
    })

  } catch (error) {
    console.error('❌ Error fetching portal data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to load your dashboard data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}