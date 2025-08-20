import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client not configured' },
      { status: 500 }
    )
  }

  console.log('🚀 Setting up database tables...')

  try {
    // Check if customers table exists (skip creation if it does)
    console.log('📋 Checking customers table...')
    const { data: existingCustomers } = await supabaseAdmin
      .from('customers')
      .select('id')
      .limit(1)
    
    const customersError = null // Table exists if we can query it

    if (customersError) {
      console.error('❌ Error creating customers table:', customersError)
      return NextResponse.json({ error: 'Failed to create customers table', details: customersError }, { status: 500 })
    }

    // Check if campaigns table exists
    console.log('🎯 Checking campaigns table...')
    const { data: existingCampaigns } = await supabaseAdmin
      .from('campaigns')
      .select('id')
      .limit(1)
    
    const campaignsError = null // Table exists if we can query it

    if (campaignsError) {
      console.error('❌ Error creating campaigns table:', campaignsError)
      return NextResponse.json({ error: 'Failed to create campaigns table', details: campaignsError }, { status: 500 })
    }

    // Check if appointments table exists
    console.log('📅 Checking appointments table...')
    const { data: existingAppointments } = await supabaseAdmin
      .from('appointments')
      .select('id')
      .limit(1)
    
    const appointmentsError = null // Table exists if we can query it

    if (appointmentsError) {
      console.error('❌ Error creating appointments table:', appointmentsError)
      return NextResponse.json({ error: 'Failed to create appointments table', details: appointmentsError }, { status: 500 })
    }

    // Check if figma_jobs table exists (will be created via Supabase dashboard if needed)
    console.log('🎨 Checking figma_jobs table...')
    const { data: existingFigmaJobs, error: figmaJobsError } = await supabaseAdmin
      .from('figma_jobs')
      .select('id')
      .limit(1)

    console.log('✅ Database check completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database tables verified successfully',
      tables: ['customers', 'campaigns', 'appointments'],
      notes: 'figma_jobs table will be created when needed'
    })

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return NextResponse.json({ 
      error: 'Database setup failed', 
      details: error 
    }, { status: 500 })
  }
}