'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface CampaignData {
  id: string
  name: string
  type: string
  status: string
  campaign_data?: {
    businessInfo: {
      businessName: string
      city: string
      phone: string
      website: string
    }
    marketInfo: {
      serviceRadius: string
      avgProjectValue: string
      busySeason: string
    }
    branding: {
      primaryColor: string
      logoUrl: string
    }
    figmaPackage: any
    createdAt: string
  }
  figma_jobs: Array<{
    id: string
    status: string
    output_urls: string[]
    created_at: string
  }>
}

interface CustomerData {
  id: string
  businessName: string
  city: string
  email: string
}

export default function MyCampaignPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generationJob, setGenerationJob] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [setupProgress, setSetupProgress] = useState<{[key: string]: boolean}>({
    'download': false,
    'meta_account': false,
    'business_manager': false,
    'upload_ads': false,
    'create_campaign': false,
    'launch': false
  })
  const [showUpsell, setShowUpsell] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchCampaignData(sessionId)
    } else {
      // Try to load with test session for demo purposes
      fetchCampaignData('test_session')
    }
  }, [sessionId])

  const fetchCampaignData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/customer?session_id=${sessionId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load campaign data')
        return
      }

      setCustomer(data.customer)
      
      // Check if campaign data was returned directly (for test sessions)
      if (data.campaign) {
        setCampaign(data.campaign)
        checkGenerationStatus(data.campaign.id)
      } 
      // Otherwise, get the latest campaign for this customer
      else if (data.customer) {
        const campaignResponse = await fetch(`/api/campaign?customer_id=${data.customer.id}`)
        const campaignData = await campaignResponse.json()
        
        if (campaignResponse.ok && campaignData.campaign) {
          setCampaign(campaignData.campaign)
          
          // Check if there's already a generation job running
          checkGenerationStatus(campaignData.campaign.id)
        }
      }

    } catch (error) {
      console.error('Error fetching campaign data:', error)
      setError('Unable to load campaign data. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkGenerationStatus = async (campaignId: string) => {
    // For test sessions, create a mock completed job
    if (campaignId === 'test_campaign_123') {
      const mockJob = {
        id: 'test_job_123',
        status: 'completed',
        progress: 100,
        stage: 5,
        message: 'Ready for download!',
        outputUrls: [
          'https://windows-ad-kit.s3.amazonaws.com/meta-ads/financing-1x1.png',
          'https://windows-ad-kit.s3.amazonaws.com/meta-ads/financing-9x16.png',
          'https://windows-ad-kit.s3.amazonaws.com/meta-ads/energy-rebate-1x1.png'
        ],
        figma_package: {
          strategicAngles: [
            {
              title: 'Financing Focus',
              reasoning: 'Address price concerns with flexible payment options'
            },
            {
              title: 'Energy Efficiency', 
              reasoning: 'High-converting angle for window contractors'
            },
            {
              title: 'Trust & Authority',
              reasoning: 'Leverage your experience for higher lead quality'
            }
          ],
          completeOnboardingData: {
            businessIntelligence: {
              businessType: 'windows_only',
              biggestChallenge: 'lead_generation',
              conversionGoal: 'phone_calls'
            }
          }
        }
      }
      setGenerationJob(mockJob)
      return
    }

    try {
      const response = await fetch(`/api/generate-ads?campaignId=${campaignId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.job) {
          setGenerationJob(data.job)
          if (data.job.status === 'processing') {
            setIsGenerating(true)
            startPolling(data.job.id)
          }
        } else {
          // No job exists, start generation
          startAdGeneration(campaignId)
        }
      } else {
        // No job exists, start generation
        startAdGeneration(campaignId)
      }
    } catch (error) {
      console.log('No existing generation job, starting new one')
      startAdGeneration(campaignId)
    }
  }

  const startAdGeneration = async (campaignId: string) => {
    try {
      setIsGenerating(true)
      const response = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          startPolling(data.jobId)
        }
      } else {
        setError('Failed to start ad generation')
        setIsGenerating(false)
      }
    } catch (error) {
      console.error('Error starting ad generation:', error)
      setError('Failed to start ad generation')
      setIsGenerating(false)
    }
  }

  const startPolling = (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate-ads?jobId=${jobId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.job) {
            setGenerationJob(data.job)
            
            if (data.job.status === 'completed') {
              setIsGenerating(false)
              clearInterval(pollInterval)
            } else if (data.job.status === 'failed') {
              setError('Ad generation failed')
              setIsGenerating(false)
              clearInterval(pollInterval)
            }
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000) // Poll every 3 seconds

    // Clean up interval on component unmount
    return () => clearInterval(pollInterval)
  }

  const getStatusInfo = () => {
    if (generationJob) {
      switch (generationJob.status) {
        case 'processing':
          return { color: '#ff6b6b', text: 'Creating your ads...', icon: '🎨' }
        case 'completed':
          return { color: '#22c55e', text: 'Ads Delivered!', icon: '✅' }
        case 'failed':
          return { color: '#ef4444', text: 'Generation Failed', icon: '❌' }
        default:
          return { color: '#a0a9c0', text: 'Preparing...', icon: '⏳' }
      }
    }
    
    if (!campaign) return { color: '#a0a9c0', text: 'Unknown', icon: '❓' }
    return { color: '#ff6b6b', text: 'Starting generation...', icon: '🎨' }
  }

  const getFigmaJobStatus = () => {
    if (generationJob) {
      switch (generationJob.status) {
        case 'pending':
          return { color: '#ff6b6b', text: 'In Queue', icon: '⏳' }
        case 'processing':
          return { color: '#ff6b6b', text: generationJob.message || 'Creating Ads...', icon: '🎨' }
        case 'completed':
          return { color: '#22c55e', text: 'Ready for Download', icon: '✅' }
        case 'failed':
          return { color: '#ef4444', text: 'Processing Failed', icon: '❌' }
        default:
          return { color: '#a0a9c0', text: 'Preparing...', icon: '⏳' }
      }
    }
    
    return { color: '#ff6b6b', text: 'Starting generation...', icon: '⏳' }
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
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Loading your campaign...</h1>
        </div>
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
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#ff6b6b' }}>
            Unable to Load Campaign
          </h1>
          <p style={{ color: '#a0a9c0', marginBottom: '30px' }}>
            {error}
          </p>
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
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo()
  const figmaStatus = getFigmaJobStatus()

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
            background: statusInfo.color === '#22c55e' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            fontWeight: 700,
            fontSize: '14px'
          }}>
            {statusInfo.icon} {statusInfo.text}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            Hey {customer?.businessName}! 👋
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#a0a9c0',
            marginBottom: '32px'
          }}>
            Your custom ads are being prepared. Here's the status:
          </p>
        </div>

        {/* Status Card */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {figmaStatus.icon}
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: figmaStatus.color,
              marginBottom: '12px'
            }}>
              {figmaStatus.text}
            </h2>
            <p style={{ fontSize: '16px', color: '#a0a9c0' }}>
              {generationJob?.status === 'completed' 
                ? 'Your strategically selected ads are ready! Based on your business intel, we chose the perfect angles for maximum performance.'
                : 'Our AI is analyzing your business details to select the best performing ad angles and create custom variations designed specifically for your market.'
              }
            </p>
          </div>

          {/* Progress Bar */}
          {generationJob && generationJob.status === 'processing' && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
                  Stage {generationJob.stage}/5: {generationJob.message}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ff6b6b' }}>
                  {generationJob.progress}%
                </span>
              </div>
              
              <div style={{
                width: '100%',
                height: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${generationJob.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)',
                  borderRadius: '6px',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', color: '#a0a9c0' }}>
                {generationJob.progress < 100 ? 
                  `Estimated ${Math.max(1, Math.ceil((100 - generationJob.progress) / 10))} minutes remaining` : 
                  'Almost done!'
                }
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px'
              }}>✓</div>
              <div>
                <h4 style={{ margin: 0, color: '#22c55e' }}>Business Info Collected</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#a0a9c0' }}>
                  {customer?.businessName} in {customer?.city}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: generationJob?.status === 'completed' ? '#22c55e' : generationJob?.status === 'processing' ? '#ff6b6b' : 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px'
              }}>
                {generationJob?.status === 'completed' ? '✓' : 
                 generationJob?.status === 'processing' ? '🎨' : '⏳'}
              </div>
              <div>
                <h4 style={{ margin: 0, color: generationJob?.status === 'completed' ? '#22c55e' : generationJob?.status === 'processing' ? '#ff6b6b' : '#a0a9c0' }}>
                  Ad Generation {generationJob?.status === 'completed' ? 'Complete' : generationJob?.status === 'processing' ? 'In Progress' : 'Pending'}
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#a0a9c0' }}>
                  Creating 12 strategic Meta ads based on your business profile & market analysis
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: generationJob?.status === 'completed' ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: generationJob?.status === 'completed' ? 'white' : '#a0a9c0',
                fontSize: '16px'
              }}>{generationJob?.status === 'completed' ? '✓' : '📋'}</div>
              <div>
                <h4 style={{ margin: 0, color: generationJob?.status === 'completed' ? '#22c55e' : '#a0a9c0' }}>
                  Delivery & Setup Guide
                </h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#a0a9c0' }}>
                  Download files + Meta Ads Manager setup instructions
                </p>
              </div>
            </div>
          </div>

          {/* Strategic Angles Selected */}
          {generationJob?.status === 'completed' && generationJob?.figma_package?.strategicAngles && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#22c55e' }}>
                🎯 AI-Selected Angles for Your Business
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#a0a9c0', marginBottom: '16px' }}>
                Based on your business intelligence, we selected these high-converting angles:
              </p>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {generationJob.figma_package.strategicAngles.map((angle: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '14px', color: '#ffffff' }}>
                      <strong>{angle.title}:</strong> {angle.reasoning}
                    </span>
                  </div>
                ))}
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '16px'
              }}>
                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
                  💡 Why these angles work for {customer?.businessName}:
                </div>
                <div style={{ fontSize: '12px', color: '#a0a9c0', marginTop: '4px' }}>
                  Our algorithm analyzed your business type ({generationJob?.figma_package?.completeOnboardingData?.businessIntelligence?.businessType?.replace('_', ' ')}), 
                  challenges ({generationJob?.figma_package?.completeOnboardingData?.businessIntelligence?.biggestChallenge?.replace('_', ' ')}), 
                  and experience level to select angles with 75%+ higher conversion rates than generic templates.
                </div>
              </div>
            </div>
          )}

          {/* Download Section */}
          {generationJob?.status === 'completed' && generationJob.outputUrls?.length > 0 && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#22c55e' }}>
                🎉 Your Strategic Ad Portfolio Is Ready!
              </h3>
              <p style={{ margin: 0, fontSize: '16px', color: '#a0a9c0', marginBottom: '24px', textAlign: 'center' }}>
                12 custom ads with AI-selected messaging designed for your specific business challenges
              </p>
              
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
                <a
                  href="data:text/plain;charset=utf-8,Download%20All%2012%20Meta%20Ads%0A%0AYour%20ads%20are%20ready%21%0A%0AFiles%20included%3A%0A%0AFinancing%20Angle%3A%0A-%20financing-1x1.png%0A-%20financing-9x16.png%0A-%20financing-16x9.png%0A-%20financing-4x5.png%0A%0AEnergy%20Rebates%3A%0A-%20energy-rebate-1x1.png%0A-%20energy-rebate-9x16.png%0A-%20energy-rebate-16x9.png%0A-%20energy-rebate-4x5.png%0A%0AFast%20Install%3A%0A-%20fast-install-1x1.png%0A-%20fast-install-9x16.png%0A-%20fast-install-16x9.png%0A-%20fast-install-4x5.png%0A%0ANext%20steps%3A%0A1.%20Upload%20to%20Meta%20Ads%20Manager%0A2.%20Create%20campaigns%20using%20our%20template%0A3.%20Launch%20and%20monitor%20performance"
                  download="windows-ad-kit-download-instructions.txt"
                  onClick={() => setSetupProgress(prev => ({ ...prev, download: true }))}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📦 Download All 12 Ads
                </a>
                
                <a
                  href={`/meta-template?session_id=${sessionId}&business=${encodeURIComponent(customer?.businessName || '')}&city=${encodeURIComponent(customer?.city || '')}`}
                  target="_blank"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📋 Setup Guide & Instructions
                </a>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                  📱 What you're getting:
                </h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#a0a9c0' }}>
                  <div>• 3 AI-selected angles based on your business profile & challenges</div>
                  <div>• 4 sizes each: Square (1:1), Story (9:16), Feed (16:9), Reel (4:5)</div>
                  <div>• Custom messaging with your unique advantages integrated</div>
                  <div>• Optimized targeting recommendations included</div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Setup Checklist */}
          {generationJob?.status === 'completed' && (
            <div style={{
              background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
                  🚀 Setup Your Meta Ads
                </h3>
                <button
                  onClick={() => setShowUpsell(true)}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Need Help? 👋
                </button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  {
                    id: 'download',
                    title: 'Download Your 12 Meta Ads',
                    description: 'Save all ad files to your computer',
                    link: '#',
                    linkText: 'Download ZIP File'
                  },
                  {
                    id: 'meta_account',
                    title: 'Verify Your Meta Business Account',
                    description: 'Ensure your Facebook/Instagram business accounts are set up',
                    link: 'https://business.facebook.com/',
                    linkText: 'Go to Meta Business'
                  },
                  {
                    id: 'business_manager',
                    title: 'Access Meta Ads Manager',
                    description: 'Navigate to your advertising dashboard',
                    link: 'https://adsmanager.facebook.com/',
                    linkText: 'Open Ads Manager'
                  },
                  {
                    id: 'upload_ads',
                    title: 'Upload Ad Creative to Meta Library',
                    description: 'Add your 12 ad variants to your creative library',
                    link: 'https://adsmanager.facebook.com/assets',
                    linkText: 'Manage Assets'
                  },
                  {
                    id: 'create_campaign',
                    title: 'Create Your Ad Campaign',
                    description: 'Set up campaigns using our recommended structure',
                    link: `/meta-template?session_id=${sessionId}&business=${encodeURIComponent(customer?.businessName || '')}&city=${encodeURIComponent(customer?.city || '')}`,
                    linkText: 'View Template'
                  },
                  {
                    id: 'launch',
                    title: 'Launch & Monitor Performance',
                    description: 'Go live and track your results',
                    link: '#',
                    linkText: 'Performance Guide'
                  }
                ].map((step, index) => (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '16px',
                      background: setupProgress[step.id] ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: setupProgress[step.id] ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div
                      onClick={() => setSetupProgress(prev => ({ ...prev, [step.id]: !prev[step.id] }))}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: setupProgress[step.id] ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
                        border: setupProgress[step.id] ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: 'white',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {setupProgress[step.id] ? '✓' : index + 1}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        margin: 0,
                        marginBottom: '4px',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: setupProgress[step.id] ? '#22c55e' : '#ffffff'
                      }}>
                        {step.title}
                      </h4>
                      <p style={{
                        margin: 0,
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#a0a9c0'
                      }}>
                        {step.description}
                      </p>
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#ff6b6b',
                          fontSize: '14px',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        {step.linkText} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Summary */}
              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(255, 107, 107, 0.1)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#a0a9c0', marginBottom: '8px' }}>
                  Setup Progress: {Object.values(setupProgress).filter(Boolean).length}/6 steps completed
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(Object.values(setupProgress).filter(Boolean).length / 6) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Business Intelligence Summary */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
            🧠 Business Intelligence Profile
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a0a9c0' }}>Business Name:</span>
              <span>{customer?.businessName || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a0a9c0' }}>Target Market:</span>
              <span>{customer?.city || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a0a9c0' }}>Business Type:</span>
              <span>{(() => {
                const businessType = generationJob?.figma_package?.completeOnboardingData?.businessIntelligence?.businessType
                switch(businessType) {
                  case 'windows_only': return 'Windows & Doors Specialist'
                  case 'full_exterior': return 'Full Exterior Contractor'
                  case 'general_contractor': return 'General Contractor'
                  default: return 'Windows & Doors Specialist'
                }
              })()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a0a9c0' }}>Years in Business:</span>
              <span>{(() => {
                const years = generationJob?.figma_package?.completeOnboardingData?.businessIntelligence?.yearsInBusiness
                switch(years) {
                  case '0_2': return '0-2 years'
                  case '3_5': return '3-5 years'
                  case '5_10': return '5-10 years'
                  case '10_plus': return '10+ years'
                  default: return 'N/A'
                }
              })()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a0a9c0' }}>Primary Challenge:</span>
              <span>{(() => {
                const challenge = generationJob?.figma_package?.completeOnboardingData?.businessIntelligence?.biggestChallenge
                switch(challenge) {
                  case 'lead_generation': return 'Lead Generation'
                  case 'pricing_competition': return 'Price Competition'
                  case 'seasonal_gaps': return 'Seasonal Slow Periods'
                  case 'lead_quality': return 'Lead Quality'
                  default: return 'Lead Generation'
                }
              })()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a0a9c0' }}>Conversion Goal:</span>
              <span>{(() => {
                const goal = generationJob?.figma_package?.completeOnboardingData?.businessIntelligence?.conversionGoal
                switch(goal) {
                  case 'phone_calls': return 'Phone Calls'
                  case 'form_fills': return 'Online Forms'
                  case 'appointments': return 'Appointments'
                  case 'quotes': return 'Quote Requests'
                  default: return 'Phone Calls'
                }
              })()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a0a9c0' }}>Campaign Strategy:</span>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600
              }}>
                AI-Optimized Angles
              </span>
            </div>
            {generationJob?.figma_package?.completeOnboardingData?.businessIntelligence?.uniqueAdvantage && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#a0a9c0' }}>Unique Advantage:</span>
                <span style={{ textAlign: 'right', maxWidth: '200px' }}>
                  {generationJob.figma_package.completeOnboardingData.businessIntelligence.uniqueAdvantage}
                </span>
              </div>
            )}
          </div>

          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '14px', color: '#ff6b6b', fontWeight: 600, marginBottom: '8px' }}>
              🎯 Strategic Advantage:
            </div>
            <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
              Your ads use data-driven angle selection based on your specific business type, challenges, and unique advantages - 
              resulting in 2-3x higher engagement rates compared to generic templates.
            </div>
          </div>
        </div>

        {/* One-Click Upload Section */}
        {generationJob?.status === 'completed' && (
          <div style={{
            background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
              🚀 Ready to Launch Your Campaign?
            </h3>
            
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '2px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#ff6b6b' }}>
                One-Click Campaign Upload to Meta
              </h4>
              <p style={{ color: '#a0a9c0', marginBottom: '24px', fontSize: '16px' }}>
                Skip the manual setup! Upload your strategic ads directly to Meta Ads Manager 
                with professional targeting and safety features pre-configured.
              </p>
              
              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px', fontSize: '14px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Professional campaign structure with 3 strategic ad sets</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>AI-optimized targeting for homeowners in {customer?.city}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Built-in safety features: budget caps, cost-per-lead limits</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>
                  <span>Campaign starts PAUSED for your safety (activate when ready)</span>
                </div>
              </div>

              <a
                href={`/campaign-upload?session_id=${sessionId}`}
                style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🚀 Launch Campaign Now
              </a>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '14px',
              color: '#a0a9c0'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: '#ffffff' }}>
                🤔 Not ready for one-click upload?
              </div>
              <div>
                You can still download your ads and upload them manually to Meta Ads Manager using our setup guide. 
                The one-click upload is completely optional and uses the same strategic ads you've already received.
              </div>
            </div>
          </div>
        )}

        {/* Support */}
        <div style={{
          background: 'rgba(255, 107, 107, 0.1)',
          border: '2px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#ff6b6b' }}>
            Questions About Your Strategic Ads?
          </h4>
          <p style={{ margin: 0, color: '#a0a9c0', marginBottom: '16px' }}>
            Need help understanding your AI-selected angles or want to discuss your targeting strategy?
          </p>
          <a
            href="mailto:support@windowadkit.com"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              display: 'inline-block'
            }}
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Upsell Modal */}
      {showUpsell && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>
                🚀 We'll Set It Up For You!
              </h2>
              <button
                onClick={() => setShowUpsell(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a0a9c0',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '16px', color: '#a0a9c0', marginBottom: '32px', lineHeight: 1.6 }}>
              Take your strategically-selected ads to the next level! Our experts will implement your 
              AI-optimized angles with precision targeting and advanced campaign structures, maximizing 
              the investment you've already made in custom creative.
            </p>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
              {[
                {
                  title: 'Express Setup',
                  price: '$197',
                  time: '24 hours',
                  description: 'We set up your campaigns and hand over the keys',
                  features: [
                    'Upload your 12 AI-selected ads to Meta',
                    'Implement strategic campaign structure', 
                    'Configure precision targeting based on your intel',
                    'Detailed handover with performance insights'
                  ],
                  popular: false
                },
                {
                  title: 'Launch & Optimize',
                  price: '$997',
                  time: '48 hours',
                  description: 'Setup + 30 days of optimization',
                  features: [
                    'Everything in Express Setup',
                    '30 days of performance monitoring',
                    'Weekly optimization adjustments',
                    'Performance reports & insights'
                  ],
                  popular: true
                },
                {
                  title: 'Full Management',
                  price: '$1,997',
                  time: '72 hours',
                  description: 'Complete hands-off management',
                  features: [
                    'Everything in Launch & Optimize',
                    'Ongoing campaign management',
                    'Monthly strategy calls',
                    'Dedicated account manager'
                  ],
                  popular: false,
                  recurring: '/month'
                }
              ].map((tier, index) => (
                <div
                  key={index}
                  style={{
                    background: tier.popular ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    border: tier.popular ? '2px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    position: 'relative'
                  }}
                >
                  {tier.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                      color: 'white',
                      padding: '4px 16px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, marginBottom: '4px' }}>
                      {tier.title}
                    </h3>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#ff6b6b', marginBottom: '4px' }}>
                      {tier.price}
                      {tier.recurring && <span style={{ fontSize: '16px', color: '#a0a9c0' }}>{tier.recurring}</span>}
                    </div>
                    <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600 }}>
                      Ready in {tier.time}
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', color: '#a0a9c0', textAlign: 'center', marginBottom: '16px' }}>
                    {tier.description}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ color: '#22c55e', fontSize: '16px' }}>✓</div>
                        <span style={{ fontSize: '14px', color: '#ffffff' }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      // This would integrate with payment processing
                      alert(`Selected: ${tier.title} - ${tier.price}${tier.recurring || ''}`)
                    }}
                    style={{
                      width: '100%',
                      background: tier.popular 
                        ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                        : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Get Started Now
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid #22c55e',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600, marginBottom: '4px' }}>
                💡 Why choose Done-With-You service?
              </div>
              <div style={{ fontSize: '13px', color: '#a0a9c0' }}>
                Save 10+ hours of learning • Avoid costly mistakes • Get professional results faster
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}