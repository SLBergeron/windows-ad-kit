import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const campaignId = searchParams.get('campaignId')

    if (!customerId && !campaignId) {
      return NextResponse.json(
        { error: 'Either customer_id or campaignId required' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    let query = supabaseAdmin
      .from('campaigns')
      .select('*')

    if (customerId) {
      query = query.eq('customer_id', customerId).order('created_at', { ascending: false })
    } else if (campaignId) {
      query = query.eq('id', campaignId)
    }

    const { data: campaigns, error } = await query

    if (error) {
      console.error('Error fetching campaign:', error)
      throw error
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json(
        { error: 'No campaign found' },
        { status: 404 }
      )
    }

    // Return the most recent campaign if multiple exist
    const campaign = campaigns[0]

    return NextResponse.json({
      success: true,
      campaign,
    })

  } catch (error) {
    console.error('Get campaign error:', error)
    return NextResponse.json(
      { error: 'Failed to get campaign' },
      { status: 500 }
    )
  }
}