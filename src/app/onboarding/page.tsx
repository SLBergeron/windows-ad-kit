'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [step, setStep] = useState(1)
  const [campaignData, setCampaignData] = useState({
    // Business Info
    businessName: '',
    city: '',
    phone: '',
    website: '',
    
    // Target Market
    serviceRadius: '20',
    avgProjectValue: '8000',
    busySeason: 'spring_summer',
    
    // Logo & Branding
    logo: null as File | null,
    logoUrl: '',
    primaryColor: '#ff6b6b',
    
    // Enhanced Discovery (New)
    businessType: 'windows_only', // windows_only, full_exterior, general_contractor
    yearsInBusiness: '5_10',
    uniqueAdvantage: '', // What makes you different?
    currentMarketing: 'referrals', // referrals, facebook, google, other
    biggestChallenge: 'lead_generation', // lead_generation, pricing_competition, seasonal_gaps
    idealCustomer: 'homeowners_35_65', // homeowners_35_65, new_construction, commercial
    previousAdSpend: 'under_1000', // under_1000, 1000_5000, 5000_plus
    conversionGoal: 'phone_calls', // phone_calls, form_fills, appointments
  })

  const [isLoading, setIsLoading] = useState(true)
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      fetchCustomerData(sessionId)
    }
  }, [sessionId])

  const fetchCustomerData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/customer?session_id=${sessionId}`)
      const data = await response.json()

      if (response.ok) {
        setCustomer(data.customer)
        setCampaignData(prev => ({
          ...prev,
          businessName: data.customer.businessName,
          city: data.customer.city,
        }))
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = async () => {
    // Package everything for Figma integration
    const campaignPackage = {
      sessionId,
      customer,
      campaignData,
      figmaData: {
        businessName: campaignData.businessName,
        city: campaignData.city,
        phone: campaignData.phone,
        logoUrl: campaignData.logoUrl,
        primaryColor: campaignData.primaryColor,
        variables: {
          v_city: campaignData.city,
          v_phone: campaignData.phone,
          v_business: campaignData.businessName,
          v_color: campaignData.primaryColor,
        },
        angles: ['financing', 'energy_rebate', 'fast_install'],
        sizes: ['1x1', '9x16', '16x9'],
        // Enhanced targeting data
        businessIntel: {
          businessType: campaignData.businessType,
          yearsInBusiness: campaignData.yearsInBusiness,
          uniqueAdvantage: campaignData.uniqueAdvantage,
          currentMarketing: campaignData.currentMarketing,
          biggestChallenge: campaignData.biggestChallenge,
          idealCustomer: campaignData.idealCustomer,
          previousAdSpend: campaignData.previousAdSpend,
          conversionGoal: campaignData.conversionGoal,
        },
      }
    }

    try {
      const response = await fetch('/api/campaign/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignPackage)
      })

      if (response.ok) {
        window.location.href = `/campaign-upload?session_id=${sessionId}`
      } else {
        alert('Error creating campaign. Please try again.')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      alert('Error creating campaign. Please try again.')
    }
  }

  const styles = {
    container: {
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
    },
    content: {
      maxWidth: '700px',
      width: '100%',
      padding: '0 24px',
    },
    card: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '20px',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '24px',
    },
    input: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      boxSizing: 'border-box' as const,
      marginBottom: '16px',
    },
    button: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    buttonSecondary: {
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      color: '#a0a9c0',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '16px',
      cursor: 'pointer',
    },
  }

  const renderWelcome = () => (
    <div style={styles.card}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>
          Welcome to Windows Ad Kit!
        </h1>
        <p style={{ fontSize: '18px', color: '#a0a9c0', lineHeight: 1.6 }}>
          Hi <strong>{customer?.businessName || 'there'}</strong>! You're about to get ads that actually work for window contractors. 
          This 5-minute setup creates <strong>custom ads designed specifically for your business</strong> - not generic templates.
        </p>
      </div>

      <div style={{ 
        background: 'rgba(255, 107, 107, 0.1)',
        border: '2px solid rgba(255, 107, 107, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#ff6b6b' }}>
          What You'll Get:
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span><strong>Smart ad angles</strong> chosen based on your business type & challenges</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🎨</span>
            <span><strong>12 custom variations</strong> with your branding, city, and messaging</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>📋</span>
            <span><strong>Complete setup guide</strong> + campaign templates for Meta Ads Manager</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <span><strong>Ready in 30 minutes</strong> (not 24 hours like other services)</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={handleNext} style={styles.button}>
          Let's Get Started →
        </button>
      </div>
    </div>
  )

  const renderBusinessInfo = () => (
    <div style={styles.card}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
        Tell Us About Your Business
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Business Name
        </label>
        <input
          type="text"
          value={campaignData.businessName}
          onChange={(e) => setCampaignData({ ...campaignData, businessName: e.target.value })}
          placeholder="Mike's Premium Windows"
          style={styles.input}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            City
          </label>
          <input
            type="text"
            value={campaignData.city}
            onChange={(e) => setCampaignData({ ...campaignData, city: e.target.value })}
            placeholder="Austin"
            style={styles.input}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Phone Number
          </label>
          <input
            type="tel"
            value={campaignData.phone}
            onChange={(e) => setCampaignData({ ...campaignData, phone: e.target.value })}
            placeholder="(512) 555-0123"
            style={styles.input}
          />
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Website (Optional)
        </label>
        <input
          type="url"
          value={campaignData.website}
          onChange={(e) => setCampaignData({ ...campaignData, website: e.target.value })}
          placeholder="www.mikeswindows.com"
          style={styles.input}
        />
      </div>
    </div>
  )

  const renderMarketInfo = () => (
    <div style={styles.card}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
        Your Market & Customers
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Service Radius (miles from your city)
        </label>
        <select
          value={campaignData.serviceRadius}
          onChange={(e) => setCampaignData({ ...campaignData, serviceRadius: e.target.value })}
          style={styles.input}
        >
          <option value="10">Within 10 miles</option>
          <option value="20">Within 20 miles</option>
          <option value="30">Within 30 miles</option>
          <option value="50">Within 50 miles</option>
        </select>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Average Project Value
        </label>
        <select
          value={campaignData.avgProjectValue}
          onChange={(e) => setCampaignData({ ...campaignData, avgProjectValue: e.target.value })}
          style={styles.input}
        >
          <option value="3000">$3,000 - $5,000</option>
          <option value="5000">$5,000 - $8,000</option>
          <option value="8000">$8,000 - $12,000</option>
          <option value="12000">$12,000+</option>
        </select>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          When are you busiest?
        </label>
        <select
          value={campaignData.busySeason}
          onChange={(e) => setCampaignData({ ...campaignData, busySeason: e.target.value })}
          style={styles.input}
        >
          <option value="year_round">Busy year-round</option>
          <option value="spring_summer">Spring & Summer</option>
          <option value="fall_winter">Fall & Winter</option>
          <option value="spring_fall">Spring & Fall</option>
        </select>
      </div>
    </div>
  )

  const renderLogoUpload = () => (
    <div style={styles.card}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
        Upload Your Logo
      </h2>
      
      <div style={{
        border: '3px dashed rgba(255, 107, 107, 0.3)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
          setCampaignData({ ...campaignData, logo: file })
          
          // Convert to base64 for temporary storage
          const reader = new FileReader()
          reader.onload = (event) => {
            setCampaignData(prev => ({
              ...prev,
              logoUrl: event.target?.result as string
            }))
          }
          reader.readAsDataURL(file)
        }
      }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="logo-upload"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setCampaignData({ ...campaignData, logo: file })
              
              // Convert to base64 for temporary storage
              const reader = new FileReader()
              reader.onload = (event) => {
                setCampaignData(prev => ({
                  ...prev,
                  logoUrl: event.target?.result as string
                }))
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        <label htmlFor="logo-upload" style={{ cursor: 'pointer', display: 'block' }}>
          {campaignData.logo ? (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#ff6b6b', marginBottom: '8px' }}>
                Logo uploaded: {campaignData.logo.name}
              </p>
              <p style={{ fontSize: '14px', color: '#a0a9c0' }}>
                Click to change or drag a new file here
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
              <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                Drop your logo here or click to upload
              </p>
              <p style={{ fontSize: '14px', color: '#a0a9c0' }}>
                PNG, JPG, or SVG • We'll automatically remove the background
              </p>
            </div>
          )}
        </label>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          Primary Brand Color
        </label>
        <input
          type="color"
          value={campaignData.primaryColor}
          onChange={(e) => setCampaignData({ ...campaignData, primaryColor: e.target.value })}
          style={{ ...styles.input, height: '60px', padding: '4px' }}
        />
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
          💡 Logo Tips:
        </h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#a0a9c0' }}>
          <li>High resolution (at least 500px wide)</li>
          <li>Clear, readable text</li>
          <li>We'll remove backgrounds automatically</li>
          <li>Your logo will appear on all 12 ads</li>
        </ul>
      </div>
    </div>
  )

  const renderBusinessIntelligence = () => (
    <div style={styles.card}>
      <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
        Tell Us About Your Business Strategy
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          What type of work do you primarily focus on?
        </label>
        <select
          value={campaignData.businessType}
          onChange={(e) => setCampaignData({ ...campaignData, businessType: e.target.value })}
          style={styles.input}
        >
          <option value="windows_only">Windows & Doors Only</option>
          <option value="full_exterior">Full Exterior (Windows, Siding, Roofing)</option>
          <option value="general_contractor">General Contracting</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Years in Business
          </label>
          <select
            value={campaignData.yearsInBusiness}
            onChange={(e) => setCampaignData({ ...campaignData, yearsInBusiness: e.target.value })}
            style={styles.input}
          >
            <option value="0_2">0-2 years</option>
            <option value="3_5">3-5 years</option>
            <option value="5_10">5-10 years</option>
            <option value="10_plus">10+ years</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Previous Monthly Ad Spend
          </label>
          <select
            value={campaignData.previousAdSpend}
            onChange={(e) => setCampaignData({ ...campaignData, previousAdSpend: e.target.value })}
            style={styles.input}
          >
            <option value="none">No previous advertising</option>
            <option value="under_1000">Under $1,000</option>
            <option value="1000_5000">$1,000 - $5,000</option>
            <option value="5000_plus">$5,000+</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          What makes your business different from competitors? (This will help create unique ads)
        </label>
        <textarea
          value={campaignData.uniqueAdvantage}
          onChange={(e) => setCampaignData({ ...campaignData, uniqueAdvantage: e.target.value })}
          placeholder="e.g., 'Lifetime warranty on all installs', '24-hour emergency service', 'Family owned for 15 years'..."
          style={{...styles.input, minHeight: '80px', resize: 'vertical' as const}}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Biggest Marketing Challenge
          </label>
          <select
            value={campaignData.biggestChallenge}
            onChange={(e) => setCampaignData({ ...campaignData, biggestChallenge: e.target.value })}
            style={styles.input}
          >
            <option value="lead_generation">Not enough leads</option>
            <option value="pricing_competition">Price competition</option>
            <option value="seasonal_gaps">Seasonal slow periods</option>
            <option value="lead_quality">Low-quality leads</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Primary Goal from Ads
          </label>
          <select
            value={campaignData.conversionGoal}
            onChange={(e) => setCampaignData({ ...campaignData, conversionGoal: e.target.value })}
            style={styles.input}
          >
            <option value="phone_calls">Phone Calls</option>
            <option value="form_fills">Online Form Submissions</option>
            <option value="appointments">Scheduled Appointments</option>
            <option value="quotes">Quote Requests</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderProgressBar = () => (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        {[1, 2, 3, 4, 5].map((stepNumber) => (
          <div
            key={stepNumber}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: step >= stepNumber 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: step >= stepNumber ? 'white' : '#a0a9c0',
              fontWeight: 700,
            }}
          >
            {stepNumber}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#a0a9c0', fontSize: '14px' }}>
        Step {step} of 5
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.content, textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Setting up your onboarding...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {step > 1 && renderProgressBar()}
        
        {step === 1 && renderWelcome()}
        {step === 2 && renderBusinessInfo()}
        {step === 3 && renderMarketInfo()}
        {step === 4 && renderBusinessIntelligence()}
        {step === 5 && renderLogoUpload()}

        {step > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <button onClick={handleBack} style={styles.buttonSecondary}>
              ← Back
            </button>
            <button 
              onClick={step === 5 ? handleComplete : handleNext}
              style={styles.button}
              disabled={step === 5 && !campaignData.logo}
            >
              {step === 5 ? 'Create My Ads 🚀' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}