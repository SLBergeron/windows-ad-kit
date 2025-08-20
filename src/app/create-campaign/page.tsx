'use client'

import { useState } from 'react'

export default function CreateCampaignPage() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAds, setGeneratedAds] = useState([])
  const [campaignData, setCampaignData] = useState({
    // Brand Kit
    logo: null as File | null,
    logoUrl: '',
    primaryColor: '#ff6b6b',
    secondaryColor: '#667eea',
    fontFamily: 'Inter',
    
    // Business Data
    businessName: '',
    city: '',
    phone: '',
    serviceArea: '',
    offer: '',
    price: '',
    cta: '',
    legal: '',
    
    // Campaign Settings
    selectedAngles: [] as string[],
    selectedSizes: [] as string[],
  })

  const styles = {
    container: {
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    section: {
      padding: '40px 0',
      maxWidth: '1000px',
      margin: '0 auto',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    card: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '24px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      boxSizing: 'border-box' as const,
    },
    button: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    buttonSecondary: {
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#a0a9c0',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      cursor: 'pointer',
    },
  }

  const campaignAngles = [
    {
      id: 'financing',
      title: 'Financing Focus',
      description: 'Promote easy financing options and payment plans',
      icon: '💳'
    },
    {
      id: 'energy_rebate',
      title: 'Energy Rebates',
      description: 'Highlight tax credits and energy savings',
      icon: '⚡'
    },
    {
      id: 'fast_install',
      title: 'Fast Installation',
      description: 'Emphasize quick turnaround and convenience',
      icon: '⚡'
    }
  ]

  const adSizes = [
    { id: '1x1', title: 'Square (1:1)', description: 'Instagram posts, Facebook' },
    { id: '9x16', title: 'Story (9:16)', description: 'Instagram Stories, TikTok' },
    { id: '16x9', title: 'Landscape (16:9)', description: 'Facebook ads, YouTube' }
  ]

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleGenerateAds = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/figma/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logoUrl: campaignData.logoUrl,
          primaryColor: campaignData.primaryColor,
          secondaryColor: campaignData.secondaryColor,
          businessName: campaignData.businessName,
          city: campaignData.city,
          phone: campaignData.phone,
          serviceArea: campaignData.serviceArea,
          offer: campaignData.offer,
          price: campaignData.price,
          cta: campaignData.cta,
          legal: campaignData.legal,
          selectedAngles: campaignData.selectedAngles,
          selectedSizes: campaignData.selectedSizes,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedAds(data.ads)
        // Redirect to campaign results page
        window.location.href = '/campaign-results'
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('Failed to generate ads. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px',
      gap: '16px',
    }}>
      {[1, 2, 3, 4].map((stepNumber) => (
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
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {stepNumber}
        </div>
      ))}
    </div>
  )

  const renderBrandKit = () => (
    <div style={styles.card}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700 }}>
        📎 Brand Kit Setup
      </h2>
      
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Logo Upload */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Business Logo
          </label>
          <div style={{
            border: '2px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            cursor: 'pointer',
          }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="logo-upload"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setCampaignData({ ...campaignData, logo: file })
                }
              }}
            />
            <label htmlFor="logo-upload" style={{ cursor: 'pointer' }}>
              {campaignData.logo ? (
                <p style={{ color: '#ff6b6b' }}>✅ {campaignData.logo.name}</p>
              ) : (
                <>
                  <p style={{ marginBottom: '8px' }}>📁 Click to upload logo</p>
                  <p style={{ fontSize: '12px', color: '#a0a9c0' }}>
                    SVG, PNG recommended • Will be auto-resized
                  </p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Colors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Primary Color
            </label>
            <input
              type="color"
              value={campaignData.primaryColor}
              onChange={(e) => setCampaignData({ ...campaignData, primaryColor: e.target.value })}
              style={{ ...styles.input, height: '48px', padding: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Secondary Color
            </label>
            <input
              type="color"
              value={campaignData.secondaryColor}
              onChange={(e) => setCampaignData({ ...campaignData, secondaryColor: e.target.value })}
              style={{ ...styles.input, height: '48px', padding: '4px' }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBusinessData = () => (
    <div style={styles.card}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700 }}>
        🏢 Business Information
      </h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Business Name *
            </label>
            <input
              type="text"
              value={campaignData.businessName}
              onChange={(e) => setCampaignData({ ...campaignData, businessName: e.target.value })}
              placeholder="Mike's Premium Windows"
              style={styles.input}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              City *
            </label>
            <input
              type="text"
              value={campaignData.city}
              onChange={(e) => setCampaignData({ ...campaignData, city: e.target.value })}
              placeholder="Austin"
              style={styles.input}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={campaignData.phone}
              onChange={(e) => setCampaignData({ ...campaignData, phone: e.target.value })}
              placeholder="(512) 555-0123"
              style={styles.input}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Service Area
            </label>
            <input
              type="text"
              value={campaignData.serviceArea}
              onChange={(e) => setCampaignData({ ...campaignData, serviceArea: e.target.value })}
              placeholder="Austin & Surrounding Areas"
              style={styles.input}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Main Offer <span style={{ fontSize: '12px', color: '#a0a9c0' }}>(max 70-80 chars)</span>
          </label>
          <input
            type="text"
            value={campaignData.offer}
            onChange={(e) => setCampaignData({ ...campaignData, offer: e.target.value })}
            placeholder="Free In-Home Consultation + Same-Day Quote"
            maxLength={80}
            style={styles.input}
          />
          <div style={{ fontSize: '12px', color: '#a0a9c0', textAlign: 'right', marginTop: '4px' }}>
            {campaignData.offer.length}/80
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Price/Promotion
            </label>
            <input
              type="text"
              value={campaignData.price}
              onChange={(e) => setCampaignData({ ...campaignData, price: e.target.value })}
              placeholder="Starting at $299/window"
              style={styles.input}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Call-to-Action <span style={{ fontSize: '12px', color: '#a0a9c0' }}>(≤22 chars)</span>
            </label>
            <input
              type="text"
              value={campaignData.cta}
              onChange={(e) => setCampaignData({ ...campaignData, cta: e.target.value })}
              placeholder="Get Free Quote"
              maxLength={22}
              style={styles.input}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Legal/Fine Print <span style={{ fontSize: '12px', color: '#a0a9c0' }}>(≤140 chars)</span>
          </label>
          <textarea
            value={campaignData.legal}
            onChange={(e) => setCampaignData({ ...campaignData, legal: e.target.value })}
            placeholder="Licensed & insured. Financing available. Some restrictions apply."
            maxLength={140}
            rows={2}
            style={{ ...styles.input, resize: 'vertical' as const }}
          />
          <div style={{ fontSize: '12px', color: '#a0a9c0', textAlign: 'right', marginTop: '4px' }}>
            {campaignData.legal.length}/140
          </div>
        </div>
      </div>
    </div>
  )

  const renderCampaignSelection = () => (
    <div style={styles.card}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700 }}>
        🎯 Campaign Angles
      </h2>
      <p style={{ color: '#a0a9c0', marginBottom: '32px' }}>
        Select the marketing angles you want to test. We recommend starting with all three.
      </p>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
        {campaignAngles.map((angle) => (
          <div
            key={angle.id}
            onClick={() => {
              const selected = campaignData.selectedAngles.includes(angle.id)
              setCampaignData({
                ...campaignData,
                selectedAngles: selected
                  ? campaignData.selectedAngles.filter(id => id !== angle.id)
                  : [...campaignData.selectedAngles, angle.id]
              })
            }}
            style={{
              ...styles.card,
              cursor: 'pointer',
              border: campaignData.selectedAngles.includes(angle.id)
                ? '2px solid #ff6b6b'
                : '1px solid rgba(255, 255, 255, 0.1)',
              background: campaignData.selectedAngles.includes(angle.id)
                ? 'rgba(255, 107, 107, 0.1)'
                : 'rgba(255, 255, 255, 0.03)',
              padding: '20px',
              margin: '0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '32px' }}>{angle.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>
                  {angle.title}
                </h3>
                <p style={{ color: '#a0a9c0', fontSize: '14px' }}>
                  {angle.description}
                </p>
              </div>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: campaignData.selectedAngles.includes(angle.id) ? '#ff6b6b' : 'rgba(255, 255, 255, 0.3)',
                background: campaignData.selectedAngles.includes(angle.id) ? '#ff6b6b' : 'transparent',
              }} />
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
        📱 Ad Sizes
      </h3>
      <div style={{ display: 'grid', gap: '16px' }}>
        {adSizes.map((size) => (
          <div
            key={size.id}
            onClick={() => {
              const selected = campaignData.selectedSizes.includes(size.id)
              setCampaignData({
                ...campaignData,
                selectedSizes: selected
                  ? campaignData.selectedSizes.filter(id => id !== size.id)
                  : [...campaignData.selectedSizes, size.id]
              })
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              border: campaignData.selectedSizes.includes(size.id)
                ? '2px solid #ff6b6b'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              background: campaignData.selectedSizes.includes(size.id)
                ? 'rgba(255, 107, 107, 0.1)'
                : 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                {size.title}
              </h4>
              <p style={{ color: '#a0a9c0', fontSize: '14px' }}>
                {size.description}
              </p>
            </div>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: campaignData.selectedSizes.includes(size.id) ? '#ff6b6b' : 'rgba(255, 255, 255, 0.3)',
              background: campaignData.selectedSizes.includes(size.id) ? '#ff6b6b' : 'transparent',
            }} />
          </div>
        ))}
      </div>
    </div>
  )

  const renderPreview = () => (
    <div style={styles.card}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 700 }}>
        👀 Campaign Preview
      </h2>
      
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          📊 Campaign Summary
        </h3>
        
        <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a0a9c0' }}>Business:</span>
            <span>{campaignData.businessName || 'Not set'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a0a9c0' }}>Location:</span>
            <span>{campaignData.city || 'Not set'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a0a9c0' }}>Angles:</span>
            <span>{campaignData.selectedAngles.length || 0} selected</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a0a9c0' }}>Sizes:</span>
            <span>{campaignData.selectedSizes.length || 0} selected</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#a0a9c0' }}>Total Ads:</span>
            <span style={{ color: '#ff6b6b', fontWeight: 600 }}>
              {(campaignData.selectedAngles.length || 0) * (campaignData.selectedSizes.length || 0)}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 107, 107, 0.1)',
        border: '1px solid rgba(255, 107, 107, 0.3)',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#ff6b6b' }}>
          🚀 Ready to Generate
        </h3>
        <p style={{ color: '#a0a9c0', fontSize: '14px', marginBottom: '20px' }}>
          Your ads will be generated using Figma templates and exported as PNG @2x files
        </p>
        <button 
          style={{
            ...styles.button,
            fontSize: '18px',
            padding: '16px 32px',
            borderRadius: '12px',
          }}
          onClick={handleGenerateAds}
          disabled={!campaignData.businessName || !campaignData.city || !campaignData.phone || campaignData.selectedAngles.length === 0 || campaignData.selectedSizes.length === 0 || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate My Ads 🎨'}
        </button>
      </div>
    </div>
  )

  const getCurrentStepContent = () => {
    switch (step) {
      case 1: return renderBrandKit()
      case 2: return renderBusinessData()
      case 3: return renderCampaignSelection()
      case 4: return renderPreview()
      default: return renderBrandKit()
    }
  }

  const stepTitles = [
    'Brand Kit',
    'Business Info',
    'Campaign Setup',
    'Review & Generate'
  ]

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={{
        position: 'sticky' as const,
        top: 0,
        background: 'rgba(10, 14, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 0',
        zIndex: 1000,
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Windows Ad Kit
          </div>
          <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
            Step {step} of 4: {stepTitles[step - 1]}
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
            Create Your Campaign
          </h1>
          <p style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Set up your brand, business info, and campaign preferences
          </p>
        </div>

        {renderStepIndicator()}
        {getCurrentStepContent()}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '32px',
        }}>
          <button
            onClick={handlePrev}
            disabled={step === 1}
            style={{
              ...styles.buttonSecondary,
              opacity: step === 1 ? 0.5 : 1,
              cursor: step === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={step === 4}
            style={{
              ...styles.button,
              opacity: step === 4 ? 0.5 : 1,
              cursor: step === 4 ? 'not-allowed' : 'pointer',
            }}
          >
            {step === 4 ? 'Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}