import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const META_APP_ID = process.env.META_APP_ID
const META_APP_SECRET = process.env.META_APP_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/meta/callback'

// Scopes required for Campaign Upload functionality
const REQUIRED_SCOPES = [
  'ads_management',
  'business_management', 
  'pages_read_engagement',
  'pages_manage_ads',
  'pages_manage_metadata',
  'leads_retrieval'
].join(',')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const businessId = searchParams.get('business_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    if (!META_APP_ID) {
      return NextResponse.json(
        { error: 'Meta App ID not configured' },
        { status: 500 }
      )
    }

    // Generate state parameter for security
    const state = `${sessionId}:${businessId || 'new'}:${Date.now()}`

    // Build Meta OAuth URL with professional permissions
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
    authUrl.searchParams.set('client_id', META_APP_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('scope', REQUIRED_SCOPES)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('display', 'popup')

    return NextResponse.json({
      success: true,
      authUrl: authUrl.toString(),
      message: 'Ready for Meta Business authentication'
    })

  } catch (error) {
    console.error('Meta auth error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize Meta authentication' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, code, state } = await request.json()

    if (!sessionId || !code) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: META_APP_ID!,
        client_secret: META_APP_SECRET!,
        redirect_uri: REDIRECT_URI,
        code: code
      })
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error?.message || 'Failed to exchange code for token')
    }

    // Get user info and business accounts
    const [userResponse, businessResponse] = await Promise.all([
      fetch(`https://graph.facebook.com/v18.0/me?access_token=${tokenData.access_token}&fields=id,name,email`),
      fetch(`https://graph.facebook.com/v18.0/me/businesses?access_token=${tokenData.access_token}&fields=id,name,verification_status,permitted_tasks`)
    ])

    const userData = await userResponse.json()
    const businessData = await businessResponse.json()

    if (!userResponse.ok || !businessResponse.ok) {
      throw new Error('Failed to fetch user or business data')
    }

    // Store Meta connection in database
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .single()

    if (customer) {
      await supabaseAdmin
        .from('meta_connections')
        .upsert({
          customer_id: customer.id,
          meta_user_id: userData.id,
          meta_user_name: userData.name,
          meta_user_email: userData.email,
          access_token: tokenData.access_token,
          business_accounts: businessData.data || [],
          scopes: REQUIRED_SCOPES.split(','),
          connected_at: new Date().toISOString(),
          expires_at: tokenData.expires_in ? 
            new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString() : 
            new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)).toISOString(), // 60 days default
          status: 'active'
        })
    }

    return NextResponse.json({
      success: true,
      user: userData,
      businesses: businessData.data || [],
      message: 'Successfully connected to Meta Business Manager'
    })

  } catch (error) {
    console.error('Meta token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to complete Meta authentication' },
      { status: 500 }
    )
  }
}