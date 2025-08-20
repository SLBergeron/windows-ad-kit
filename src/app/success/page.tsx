'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface CustomerData {
  id: string
  businessName: string
  city: string
  email: string
  createdAt: string
}

interface CampaignData {
  id: string
  name: string
  type: string
  status: string
  budget: number
  appointmentsBooked: number
  costPerAppointment: number
  revenueGenerated: number
  launchesAt: string
  hoursUntilLaunch: number
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      fetchCustomerData(sessionId)
    } else {
      setError('Invalid session ID')
      setIsLoading(false)
    }
  }, [sessionId])

  const fetchCustomerData = async (sessionId: string) => {
    try {
      console.log('🔍 Fetching customer data for session:', sessionId)
      
      const response = await fetch(`/api/customer?session_id=${sessionId}`)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setError('Customer not found. Please check your email for confirmation or contact support.')
        } else {
          setError(data.error || 'Failed to load customer data')
        }
        return
      }

      console.log('✅ Customer data loaded:', data.customer.businessName)
      setCustomer(data.customer)
      setCampaign(data.campaign)

    } catch (error) {
      console.error('❌ Error fetching customer data:', error)
      setError('Unable to load customer data. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ 
        backgroundColor: '#0a0e27', 
        color: '#ffffff', 
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid rgba(255, 107, 107, 0.3)',
            borderTop: '3px solid #ff6b6b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Loading your account...</h1>
          <p style={{ color: '#a0a9c0' }}>Please wait while we retrieve your campaign details.</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#0a0e27', 
        color: '#ffffff', 
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ 
            fontSize: '60px', 
            marginBottom: '20px' 
          }}>⚠️</div>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#ff6b6b' }}>
            Unable to Load Your Account
          </h1>
          <p style={{ color: '#a0a9c0', marginBottom: '30px' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <Link 
              href="mailto:support@windowadkit.com" 
              style={{
                background: 'transparent',
                color: '#a0a9c0',
                border: '1px solid #a0a9c0',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      backgroundColor: '#0a0e27', 
      color: '#ffffff', 
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(180deg, #0a0e27 0%, rgba(255, 255, 255, 0.02) 100%)',
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 900, 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Windows Ad Kit
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
            color: 'white',
            padding: '10px 20px', 
            borderRadius: '25px', 
            fontWeight: 700,
            fontSize: '14px'
          }}>
            ✅ Purchase Complete
          </div>
        </div>
      </header>

      {/* Success Content */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          {/* Success Badge */}
          <div style={{ 
            display: 'inline-block',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '30px',
            fontWeight: 700,
            marginBottom: '30px',
            fontSize: '16px',
            boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)'
          }}>
            🎉 Welcome to Windows Ad Kit, {customer?.businessName}!
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '30px'
          }}>
            Your Strategic Ads 
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Are Being Created
            </span>
          </h1>
          
          <p style={{ 
            fontSize: '20px', 
            color: '#a0a9c0', 
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Welcome <strong style={{ color: '#22c55e' }}>{customer?.businessName}</strong>! 
            Your AI-selected strategic angles and custom ad templates are being prepared for the {customer?.city} market.
            <br /><br />
            <strong>Next:</strong> Complete your 5-minute onboarding to receive your personalized ads in 30 minutes.
          </p>

          {/* What Happens Next */}
          <div style={{ 
            background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
            borderRadius: '24px',
            padding: '50px 40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            marginBottom: '50px',
            textAlign: 'left'
          }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 900,
              marginBottom: '40px', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent'
            }}>
              What Happens Next
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gap: '25px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#ff6b35', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '18px',
                  flexShrink: 0
                }}>1</div>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '8px', color: '#ff6b35' }}>Complete 5-Minute Onboarding</h3>
                  <p style={{ margin: 0, color: '#94a3b8' }}>Tell us about your business so our AI can select the perfect strategic angles for your market. This creates truly personalized ads, not generic templates.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#ff6b35', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '18px',
                  flexShrink: 0
                }}>2</div>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '8px', color: '#ff6b35' }}>AI Creates Your Strategic Ads</h3>
                  <p style={{ margin: 0, color: '#94a3b8' }}>Our algorithm analyzes your business type, challenges, and unique advantages to create 12 custom ad variations with messaging tailored to your strengths.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#22c55e', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '18px',
                  flexShrink: 0
                }}>3</div>
                <div>
                  <h3 style={{ margin: 0, marginBottom: '8px', color: '#22c55e' }}>Download & Launch (30 Minutes)</h3>
                  <p style={{ margin: 0, color: '#94a3b8' }}>Get your strategic ad portfolio with Meta Ads Manager setup instructions. Launch immediately using our proven templates and targeting guidance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Start Onboarding Link */}
          <div style={{ marginBottom: '50px' }}>
            <Link
              href={`/onboarding?session_id=${sessionId}`}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                padding: '24px 48px',
                fontSize: '20px',
                fontWeight: 700,
                border: 'none',
                borderRadius: '16px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                margin: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 107, 107, 0.3)'
              }}
            >
              🎨 Start Creating My Ads →
            </Link>
          </div>

          {/* Contact Info */}
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.1)',
            border: '2px solid #22c55e',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ 
              margin: 0, 
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: 700,
              color: '#22c55e'
            }}>
              Questions? Need Help?
            </h3>
            <p style={{ 
              margin: 0, 
              color: '#a0a9c0', 
              marginBottom: '20px',
              fontSize: '18px'
            }}>
              Our team is here to ensure your success with strategic ad creation.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <a 
                href="mailto:support@windowadkit.com"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📧 Email Support
              </a>
              <a 
                href="https://windowsadkit.slack.com/support" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  color: '#22c55e',
                  border: '2px solid #22c55e',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                💬 Open Chat
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}