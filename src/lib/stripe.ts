import Stripe from 'stripe'

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables')
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn('⚠️ NEXT_PUBLIC_BASE_URL not set, using localhost:3000')
}

// Initialize Stripe with better error handling
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// Windows Ad Kit product configuration
export const WINDOWS_AD_KIT_PRODUCT = {
  name: 'Windows Ad Kit',
  description: '20 Appointments in 28 Days - Guaranteed advertising system for window contractors',
  price: 29500, // $295.00 in cents
  currency: 'usd',
  mode: 'payment' as const,
}

export interface CheckoutSessionParams {
  businessName: string
  city: string
  email: string
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession(params: CheckoutSessionParams) {
  try {
    console.log('🚀 Creating Stripe checkout session for:', {
      businessName: params.businessName,
      city: params.city,
      email: params.email,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: WINDOWS_AD_KIT_PRODUCT.currency,
            product_data: {
              name: WINDOWS_AD_KIT_PRODUCT.name,
              description: WINDOWS_AD_KIT_PRODUCT.description,
              images: [], // Add product images later
            },
            unit_amount: WINDOWS_AD_KIT_PRODUCT.price,
          },
          quantity: 1,
        },
      ],
      mode: WINDOWS_AD_KIT_PRODUCT.mode,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        business_name: params.businessName,
        city: params.city,
        email: params.email,
        product: 'windows_ad_kit',
        timestamp: new Date().toISOString(),
      },
      customer_email: params.email,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      custom_text: {
        submit: {
          message: 'Your ads will be live within 72 hours of purchase! 🚀'
        }
      },
      // Add automatic tax calculation (if enabled in Stripe)
      automatic_tax: {
        enabled: false, // Set to true if you have tax calculation enabled
      },
    })

    console.log('✅ Stripe session created successfully:', session.id)
    return session

  } catch (error) {
    console.error('❌ Failed to create Stripe checkout session:', error)
    
    // Re-throw with more context
    if (error instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe Error: ${error.message}`)
    } else {
      throw new Error(`Unknown error creating checkout session: ${error}`)
    }
  }
}

// Helper function to verify webhook signatures
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(body, signature, secret)
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error)
    throw error
  }
}