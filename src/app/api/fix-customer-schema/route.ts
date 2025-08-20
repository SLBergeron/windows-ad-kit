import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    console.log('🔧 Fixing customer table schema to allow null stripe_customer_id')

    // Make stripe_customer_id nullable
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'ALTER TABLE customers ALTER COLUMN stripe_customer_id DROP NOT NULL;'
    })

    if (error) {
      console.error('❌ Error updating schema:', error)
      return NextResponse.json(
        { error: 'Failed to update schema', details: error },
        { status: 500 }
      )
    }

    console.log('✅ Successfully made stripe_customer_id nullable')

    return NextResponse.json({
      success: true,
      message: 'Schema updated: stripe_customer_id is now nullable'
    })

  } catch (error) {
    console.error('❌ Schema fix error:', error)
    return NextResponse.json(
      { error: 'Failed to fix schema' },
      { status: 500 }
    )
  }
}