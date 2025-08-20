import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🛒 Checkout API called')
    
    const body = await request.json()
    const { businessName, city, email } = body

    console.log('📋 Checkout request data:', { businessName, city, email })

    // Validate required fields
    const validationErrors = []
    if (!businessName?.trim()) validationErrors.push('Business name is required')
    if (!city?.trim()) validationErrors.push('City is required')
    if (!email?.trim()) validationErrors.push('Email is required')
    
    if (validationErrors.length > 0) {
      console.log('❌ Validation failed:', validationErrors)
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email)
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
    console.log('🌐 Using base URL:', baseUrl)

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      businessName: businessName.trim(),
      city: city.trim(),
      email: email.trim(),
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/get-started?canceled=true`,
    })

    const duration = Date.now() - startTime
    console.log(`✅ Checkout session created successfully in ${duration}ms:`, {
      sessionId: session.id,
      checkoutUrl: session.url,
    })

    return NextResponse.json({ 
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      message: 'Checkout session created successfully'
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`❌ Checkout error after ${duration}ms:`, error)
    
    // Determine error type and response
    let errorMessage = 'Failed to create checkout session'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('Stripe Error')) {
        errorMessage = 'Payment processing is temporarily unavailable. Please try again.'
        statusCode = 503
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = 'Network error. Please check your connection and try again.'
        statusCode = 503
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        // Only include technical details in development
        ...(process.env.NODE_ENV === 'development' && {
          technicalError: error instanceof Error ? error.message : String(error)
        })
      },
      { status: statusCode }
    )
  }
}