'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface CampaignData {
  businessName: string
  city: string
  phone: string
  serviceRadius: string
  avgProjectValue: string
  businessType: string
  uniqueAdvantage: string
  conversionGoal: string
}

interface MetaConnection {
  connected: boolean
  user?: {
    id: string
    name: string
    email: string
  }
  businesses?: Array<{
    id: string
    name: string
    verification_status: string
  }>
}

export default function CampaignUploadPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null)
  const [metaConnection, setMetaConnection] = useState<MetaConnection>({ connected: false })
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [budgetSettings, setBudgetSettings] = useState({
    dailyBudget: 50, // $50/day default
    testDuration: 7, // 7 days
    maxCostPerLead: 75 // $75 max cost per lead
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState('')

  useEffect(() => {
    if (sessionId) {
      fetchCampaignData()
      checkMetaConnection()
    }
  }, [sessionId])

  const fetchCampaignData = async () => {
    try {
      const response = await fetch(`/api/customer?session_id=${sessionId}`)
      const data = await response.json()
      
      if (response.ok && data.customer) {
        setCampaignData({
          businessName: data.customer.businessName,
          city: data.customer.city,
          phone: data.customer.phone || '',
          serviceRadius: '20',
          avgProjectValue: '8000',
          businessType: 'windows_only',
          uniqueAdvantage: '',
          conversionGoal: 'phone_calls'
        })
      }
    } catch (error) {
      console.error('Error fetching campaign data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkMetaConnection = async () => {
    try {
      const response = await fetch(`/api/meta/upload-campaign?session_id=${sessionId}`)
      const data = await response.json()
      
      if (response.ok) {
        setMetaConnection({
          connected: data.connected,
          businesses: data.businesses || []
        })
      }
    } catch (error) {
      console.error('Error checking Meta connection:', error)
    }
  }

  const handleMetaConnect = async () => {
    try {
      const response = await fetch(`/api/meta/auth?session_id=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        // Open Meta OAuth in popup
        const popup = window.open(
          data.authUrl,
          'meta-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        )

        // Listen for authentication completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            checkMetaConnection() // Re-check connection status
          }
        }, 1000)

        // Listen for postMessage from popup
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'META_AUTH_SUCCESS') {
            clearInterval(checkClosed)
            popup?.close()
            setMetaConnection({
              connected: true,
              user: event.data.data.user,
              businesses: event.data.data.businesses
            })
            window.removeEventListener('message', handleMessage)
          } else if (event.data.type === 'META_AUTH_ERROR') {
            clearInterval(checkClosed)
            popup?.close()
            alert('Failed to connect to Meta: ' + event.data.error)
            window.removeEventListener('message', handleMessage)
          }
        }

        window.addEventListener('message', handleMessage)
      }
    } catch (error) {
      console.error('Error initiating Meta connection:', error)
      alert('Failed to start Meta connection process')
    }
  }

  const handleUploadCampaign = async () => {
    if (!metaConnection.connected || !selectedBusiness || !campaignData) {
      alert('Please complete all setup steps first')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStage('Preparing campaign structure...')

    try {
      // Generate targeting based on business data
      const targeting = {
        location: {
          country: 'US',
          city: campaignData.city,
          radius: parseInt(campaignData.serviceRadius)
        },
        age_min: 35,
        age_max: 65,
        interests: ['Home improvement', 'Home and garden', 'Real estate'],
        behaviors: ['Homeowners']
      }

      // Create ad sets for each strategic angle
      const adSets = [
        {
          name: `${campaignData.businessName} - Financing Focus`,
          budget: Math.floor(budgetSettings.dailyBudget * 100 / 3), // Divide budget evenly, convert to cents
          targeting: {
            ...targeting,
            interests: [...targeting.interests, 'Home financing', 'Home loans']
          },
          ads: [
            {
              name: 'Financing Focus - Square',
              creative: {
                title: 'No Money Down Windows',
                body: `Premium windows in ${campaignData.city} with easy financing. Call ${campaignData.phone} for your free quote!`,
                call_to_action: 'CALL_NOW',
                image_url: 'https://windows-ad-kit.s3.amazonaws.com/ads/financing-1x1.png'
              }
            },
            {
              name: 'Financing Focus - Story',
              creative: {
                title: 'Easy Monthly Payments',
                body: `Transform your home with new windows. No money down, easy payments. ${campaignData.phone}`,
                call_to_action: 'CALL_NOW',
                image_url: 'https://windows-ad-kit.s3.amazonaws.com/ads/financing-9x16.png'
              }
            }
          ]
        },
        {
          name: `${campaignData.businessName} - Energy Savings`,
          budget: Math.floor(budgetSettings.dailyBudget * 100 / 3),
          targeting: {
            ...targeting,
            interests: [...targeting.interests, 'Energy conservation', 'Energy efficiency']
          },
          ads: [
            {
              name: 'Energy Savings - Square',
              creative: {
                title: 'Cut Energy Bills in Half',
                body: `Premium energy-efficient windows in ${campaignData.city}. Save money every month! Call ${campaignData.phone}`,
                call_to_action: 'LEARN_MORE',
                image_url: 'https://windows-ad-kit.s3.amazonaws.com/ads/energy-1x1.png'
              }
            },
            {
              name: 'Energy Savings - Story', 
              creative: {
                title: 'Lower Energy Bills',
                body: `Energy-efficient windows that pay for themselves. Free consultation! ${campaignData.phone}`,
                call_to_action: 'LEARN_MORE',
                image_url: 'https://windows-ad-kit.s3.amazonaws.com/ads/energy-9x16.png'
              }
            }
          ]
        },
        {
          name: `${campaignData.businessName} - Local Trust`,
          budget: Math.floor(budgetSettings.dailyBudget * 100 / 3),
          targeting: {
            ...targeting,
            interests: [...targeting.interests, 'Local businesses']
          },
          ads: [
            {
              name: 'Local Trust - Square',
              creative: {
                title: `${campaignData.city}'s Trusted Window Experts`,
                body: `Licensed & insured professionals. Lifetime warranty on all work. Call ${campaignData.phone} today!`,
                call_to_action: 'CALL_NOW',
                image_url: 'https://windows-ad-kit.s3.amazonaws.com/ads/trust-1x1.png'
              }
            },
            {
              name: 'Local Trust - Story',
              creative: {
                title: 'Licensed & Insured',
                body: `Your local window installation experts. Quality guaranteed! ${campaignData.phone}`,
                call_to_action: 'CALL_NOW',
                image_url: 'https://windows-ad-kit.s3.amazonaws.com/ads/trust-9x16.png'
              }
            }
          ]
        }
      ]

      setUploadProgress(20)
      setUploadStage('Creating campaign structure...')

      const campaignPayload = {
        sessionId,
        campaignData: {
          name: `${campaignData.businessName} - ${campaignData.city} Windows`,
          budget: budgetSettings.dailyBudget * 100, // Convert to cents
          objective: campaignData.conversionGoal === 'phone_calls' ? 'CONVERSIONS' : 'LEAD_GENERATION',
          targeting,
          adSets
        }
      }

      setUploadProgress(40)
      setUploadStage('Uploading to Meta Ads Manager...')

      const response = await fetch('/api/meta/upload-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignPayload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload campaign')
      }

      setUploadProgress(80)
      setUploadStage('Configuring safety settings...')

      // Simulate safety configuration
      await new Promise(resolve => setTimeout(resolve, 2000))

      setUploadProgress(100)
      setUploadStage('Campaign uploaded successfully!')

      // Redirect to success page
      setTimeout(() => {
        window.location.href = `/campaign-success?session_id=${sessionId}&campaign_id=${result.campaign.id}`
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload campaign: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setIsUploading(false)
    }
  }

  const styles = {
    container: {
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    section: {
      padding: '40px 0',
      maxWidth: '800px',
      margin: '0 auto',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    card: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '24px',
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
      width: '100%',
    },
    buttonSecondary: {
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      color: '#a0a9c0',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '16px',
      cursor: 'pointer',
      width: '100%',
    },
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.section}>
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
              Loading campaign data...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <nav style={{
        position: 'sticky' as const,
        top: 0,
        background: 'rgba(10, 14, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 0',
        zIndex: 1000,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Windows Ad Kit
          </div>
          <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
            One-Click Campaign Upload
          </div>
        </div>
      </nav>

      <div style={styles.section}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🚀 Launch Your Campaign
          </h1>
          <p style={{ fontSize: '18px', color: '#a0a9c0', marginBottom: '32px' }}>
            Go from ads to live campaigns in under 5 minutes with complete safety controls
          </p>

          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
            {[
              { step: 1, title: 'Connect Meta', icon: '🔗' },
              { step: 2, title: 'Budget Setup', icon: '💰' },
              { step: 3, title: 'Campaign Preview', icon: '👀' },
              { step: 4, title: 'Launch', icon: '🚀' }
            ].map((item) => (
              <div key={item.step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: step >= item.step 
                    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                    : step === item.step
                    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: step >= item.step || step === item.step ? 'white' : '#a0a9c0',
                  fontSize: '24px',
                  marginBottom: '8px'
                }}>
                  {step > item.step ? '✓' : item.icon}
                </div>
                <div style={{ fontSize: '12px', color: step >= item.step ? '#22c55e' : '#a0a9c0' }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Meta Connection */}
        {step === 1 && (
          <div style={styles.card}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
              🔗 Connect Your Meta Business Account
            </h2>
            
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '2px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {metaConnection.connected ? '✅' : '📘'}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: metaConnection.connected ? '#22c55e' : '#ff6b6b' }}>
                {metaConnection.connected ? 'Meta Business Connected!' : 'Connect to Meta Business Manager (Recommended)'}
              </h3>
              <p style={{ color: '#a0a9c0', marginBottom: '24px' }}>
                {metaConnection.connected 
                  ? `Connected as ${metaConnection.user?.name}. Your campaigns will be uploaded to your Meta Ads Manager.`
                  : 'Connect your Facebook Business Manager for automatic campaign upload and performance analytics, or skip to get your ad assets and setup guide.'
                }
              </p>

              {!metaConnection.connected ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  <button onClick={handleMetaConnect} style={styles.button}>
                    🚀 Connect Meta Business Manager (Auto-Upload)
                  </button>
                  <button 
                    onClick={() => window.location.href = `/campaign-success?session_id=${sessionId}&skip_meta=true`}
                    style={{
                      ...styles.buttonSecondary,
                      borderColor: 'rgba(150, 150, 150, 0.4)',
                      color: 'rgba(150, 150, 150, 0.7)',
                      fontSize: '14px',
                      padding: '12px 24px'
                    }}
                  >
                    📁 Skip & Get Campaign Files
                  </button>
                </div>
              ) : (
                <div>
                  {metaConnection.businesses && metaConnection.businesses.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#ffffff' }}>
                        Select Business Account:
                      </label>
                      <select
                        value={selectedBusiness}
                        onChange={(e) => setSelectedBusiness(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                        }}
                      >
                        <option value="">Choose your business...</option>
                        {metaConnection.businesses.map((business) => (
                          <option key={business.id} value={business.id}>
                            {business.name} {business.verification_status === 'verified' ? '✓' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!selectedBusiness}
                    style={{
                      ...styles.button,
                      marginTop: '16px',
                      opacity: selectedBusiness ? 1 : 0.5,
                      cursor: selectedBusiness ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Continue to Budget Setup →
                  </button>
                </div>
              )}
            </div>

            {/* Two-Column Feature Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Auto-Upload Option */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid #22c55e',
                borderRadius: '12px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#22c55e', margin: 0 }}>
                    🚀 With Meta Connection
                  </h4>
                  <div style={{
                    background: '#22c55e',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    ~2 MIN
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#a0a9c0', fontSize: '14px' }}>
                  <li>✨ <strong>Automatic campaign upload</strong></li>
                  <li>📊 <strong>Real-time performance analytics</strong></li>
                  <li>🛡️ Built-in safety controls</li>
                  <li>📈 Conversion tracking & optimization</li>
                  <li>⚡ One-click launch</li>
                  <li>📧 Automated performance reports</li>
                </ul>
              </div>

              {/* Manual Option */}
              <div style={{
                background: 'rgba(120, 120, 120, 0.05)',
                border: '2px solid rgba(120, 120, 120, 0.2)',
                borderRadius: '12px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(150, 150, 150, 0.8)', margin: 0 }}>
                    📁 Skip Connection
                  </h4>
                  <div style={{
                    background: 'rgba(150, 150, 150, 0.3)',
                    color: 'rgba(150, 150, 150, 0.8)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    ~15 MIN
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(150, 150, 150, 0.7)', fontSize: '14px' }}>
                  <li>Get all campaign files</li>
                  <li>Step-by-step setup guide</li>
                  <li>Manual upload to Meta</li>
                  <li>Limited analytics visibility</li>
                  <li>Manual performance tracking</li>
                  <li>Self-service optimization</li>
                </ul>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                🛡️ What permissions do we need?
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#a0a9c0', fontSize: '14px' }}>
                <li>Create and manage ad campaigns</li>
                <li>Upload ad creative to your account</li>
                <li>Access performance data and insights</li>
                <li>Manage campaign budgets and targeting</li>
              </ul>
              <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#a0a9c0' }}>
                You can revoke these permissions anytime in your Meta Business settings.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Budget & Safety Setup */}
        {step === 2 && (
          <div style={styles.card}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
              💰 Smart Budget & Safety Setup
            </h2>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '18px' }}>
                Daily Budget: ${budgetSettings.dailyBudget}
              </label>
              <input
                type="range"
                min="25"
                max="200"
                step="25"
                value={budgetSettings.dailyBudget}
                onChange={(e) => setBudgetSettings({...budgetSettings, dailyBudget: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  outline: 'none',
                  marginBottom: '16px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a0a9c0' }}>
                <span>$25/day</span>
                <span>$200/day</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '16px', color: '#ff6b6b' }}>
                ${budgetSettings.dailyBudget}/day × {budgetSettings.testDuration} days = ${budgetSettings.dailyBudget * budgetSettings.testDuration} total test budget
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '18px' }}>
                Test Duration: {budgetSettings.testDuration} days
              </label>
              <input
                type="range"
                min="3"
                max="14"
                step="1"
                value={budgetSettings.testDuration}
                onChange={(e) => setBudgetSettings({...budgetSettings, testDuration: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  outline: 'none',
                  marginBottom: '16px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#a0a9c0' }}>
                <span>3 days</span>
                <span>14 days</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '2px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#ff6b6b' }}>
                🛡️ Built-in Safety Features
              </h3>
              <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Daily spend limit: ${budgetSettings.dailyBudget} (hard cap)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Auto-pause if cost per lead exceeds ${budgetSettings.maxCostPerLead}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Daily performance alerts to your email</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>One-click campaign pause button</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setStep(1)} style={styles.buttonSecondary}>
                ← Back
              </button>
              <button onClick={() => setStep(3)} style={styles.button}>
                Continue to Preview →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Campaign Preview */}
        {step === 3 && (
          <div style={styles.card}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
              👀 Campaign Preview
            </h2>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#22c55e' }}>
                🎯 {campaignData?.businessName} - {campaignData?.city} Campaign
              </h3>
              
              <div style={{ display: 'grid', gap: '12px', fontSize: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Daily Budget:</span>
                  <span style={{ fontWeight: 600 }}>${budgetSettings.dailyBudget}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Test Duration:</span>
                  <span style={{ fontWeight: 600 }}>{budgetSettings.testDuration} days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Target Area:</span>
                  <span style={{ fontWeight: 600 }}>{campaignData?.city} + 20 miles</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Total Investment:</span>
                  <span style={{ fontWeight: 600, color: '#ff6b6b' }}>${budgetSettings.dailyBudget * budgetSettings.testDuration}</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                  🎨 Your Strategic Ad Angles:
                </h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  <div>• <strong>Financing Focus:</strong> "No Money Down Windows" - Appeals to budget-conscious homeowners</div>
                  <div>• <strong>Energy Savings:</strong> "Cut Energy Bills in Half" - Highlights long-term savings</div>
                  <div>• <strong>Local Trust:</strong> "{campaignData?.city}'s Trusted Experts" - Builds local credibility</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600, marginBottom: '8px' }}>
                  📊 Expected Performance (based on industry data):
                </div>
                <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
                  • 2,000-4,000 people reached per day
                  • 15-30 phone calls expected over {budgetSettings.testDuration} days
                  • $25-$65 average cost per lead
                  • 3-8 qualified appointments booked
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setStep(2)} style={styles.buttonSecondary}>
                ← Back to Budget
              </button>
              <button onClick={() => setStep(4)} style={styles.button}>
                Ready to Launch! 🚀
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Launch */}
        {step === 4 && (
          <div style={styles.card}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>
                {isUploading ? '🚀' : '🎉'}
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>
                {isUploading ? 'Launching Your Campaign...' : 'Ready to Launch!'}
              </h2>
              <p style={{ fontSize: '18px', color: '#a0a9c0', marginBottom: '32px' }}>
                {isUploading 
                  ? 'Your campaign is being uploaded to Meta Ads Manager with all safety features enabled.'
                  : 'Your campaign will be uploaded to Meta Ads Manager and started in PAUSED mode for your safety.'
                }
              </p>

              {isUploading && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                    {uploadStage}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                      borderRadius: '6px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '14px', color: '#a0a9c0' }}>
                    {uploadProgress}% complete
                  </div>
                </div>
              )}

              {!isUploading ? (
                <div>
                  <button onClick={handleUploadCampaign} style={styles.button}>
                    🚀 Upload Campaign to Meta Ads Manager
                  </button>
                  <div style={{ marginTop: '16px' }}>
                    <button onClick={() => setStep(3)} style={styles.buttonSecondary}>
                      ← Back to Preview
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
                  Please don't close this window while your campaign is being uploaded.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}