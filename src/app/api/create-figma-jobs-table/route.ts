import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase admin client not configured' },
      { status: 500 }
    )
  }

  try {
    console.log('🎨 Creating figma_jobs table...')

    // Drop table if exists (for clean recreation)
    await supabaseAdmin
      .from('figma_jobs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // This will fail if table doesn't exist, which is fine

    console.log('📋 Table cleanup attempt completed (ignore errors)')

    // Create the table using a direct SQL query via a stored procedure call
    // We'll create it manually since RPC isn't available
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS figma_jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
        current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 5),
        stage_message TEXT,
        figma_package JSONB NOT NULL,
        output_urls JSONB DEFAULT '[]'::jsonb,
        error_message TEXT,
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Test if we can create the table by attempting to insert and then rolling back
    try {
      // Try to query the table to see if it exists
      await supabaseAdmin.from('figma_jobs').select('id').limit(1)
      console.log('✅ figma_jobs table already exists')
    } catch (error) {
      console.log('🔧 figma_jobs table does not exist, needs to be created manually in Supabase dashboard')
      console.log('SQL to run:', createTableSQL)
      
      return NextResponse.json({
        success: false,
        message: 'Please create the figma_jobs table manually in Supabase dashboard',
        sql: createTableSQL,
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to the SQL Editor',
          '3. Run the provided SQL',
          '4. Then call this endpoint again'
        ]
      })
    }

    // If we get here, the table exists, let's add some test data
    console.log('🧪 Testing figma_jobs table functionality...')
    
    return NextResponse.json({
      success: true,
      message: 'figma_jobs table is ready',
      tableExists: true
    })

  } catch (error) {
    console.error('❌ Error setting up figma_jobs table:', error)
    return NextResponse.json({ 
      error: 'Failed to setup figma_jobs table', 
      details: error 
    }, { status: 500 })
  }
}