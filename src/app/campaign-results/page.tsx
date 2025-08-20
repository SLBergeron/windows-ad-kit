'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface GeneratedAd {
  id: string
  angle: string
  size: string
  componentKey: string
  variables: Record<string, string>
  slots: Record<string, string>
  status: string
  exportUrl: string
  created: string
}

export default function CampaignResultsPage() {
  const [ads, setAds] = useState<GeneratedAd[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    // In a real app, this would fetch from an API based on campaign ID
    // For now, we'll use mock data
    const mockAds: GeneratedAd[] = [
      {
        id: 'wnd_financing_1x1_v1',
        angle: 'financing',
        size: '1x1',
        componentKey: 'wnd_financing_1x1_v1',
        variables: {
          v_city: 'Austin',
          v_phone: '(512) 555-0123',
          v_offer: 'Free In-Home Consultation + Same-Day Quote',
          v_price: 'Starting at $299/window',
          v_cta: 'Get Free Quote',
          v_legal: 'Licensed & insured. Financing available.',
        },
        slots: {
          slot_headline: 'New Windows in Austin - $0 Down',
          slot_subhead: 'Free In-Home Consultation + Same-Day Quote',
          slot_price: 'Starting at $299/window',
          slot_cta: 'Get Free Quote',
          slot_legal: 'Licensed & insured. Financing available.',
          slot_city: 'Austin',
          slot_phone: '(512) 555-0123',
          slot_logo: '',
          slot_photo: 'https://mock-photos.com/financing-family.jpg',
        },
        status: 'generated',
        exportUrl: 'https://mock-figma-export.com/financing-1x1.png',
        created: new Date().toISOString(),
      },
      {
        id: 'wnd_energy_rebate_1x1_v1',
        angle: 'energy_rebate',
        size: '1x1',
        componentKey: 'wnd_energy_rebate_1x1_v1',
        variables: {
          v_city: 'Austin',
          v_phone: '(512) 555-0123',
          v_offer: 'Free In-Home Consultation + Same-Day Quote',
          v_price: 'Starting at $299/window',
          v_cta: 'Get Free Quote',
          v_legal: 'Licensed & insured. Financing available.',
        },
        slots: {
          slot_headline: 'Austin Energy Rebates - Save Big',
          slot_subhead: 'Free In-Home Consultation + Same-Day Quote',
          slot_price: 'Starting at $299/window',
          slot_cta: 'Get Free Quote',
          slot_legal: 'Licensed & insured. Financing available.',
          slot_city: 'Austin',
          slot_phone: '(512) 555-0123',
          slot_logo: '',
          slot_photo: 'https://mock-photos.com/energy-efficient-home.jpg',
        },
        status: 'generated',
        exportUrl: 'https://mock-figma-export.com/energy_rebate-1x1.png',
        created: new Date().toISOString(),
      },
    ]
    
    setAds(mockAds)
    setLoading(false)
  }, [])

  const styles = {
    container: {
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    section: {
      padding: '40px 0',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    card: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '24px',
    },
    button: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '14px',
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
      fontSize: '14px',
      cursor: 'pointer',
    },
  }

  const angleLabels = {
    financing: 'Financing Focus',
    energy_rebate: 'Energy Rebates',
    fast_install: 'Fast Installation',
  }

  const sizeLabels = {
    '1x1': 'Square (1:1)',
    '9x16': 'Story (9:16)',
    '16x9': 'Landscape (16:9)',
  }

  const handleDownload = async (ad: GeneratedAd) => {
    // In a real implementation, this would trigger the actual download
    alert(`Downloading ${ad.id}.png @2x`)
  }

  const handleDownloadAll = () => {
    alert(`Downloading all ${ads.length} ads as ZIP file`)
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.section, textAlign: 'center', paddingTop: '200px' }}>
          <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Loading your ads...
          </div>
        </div>
      </div>
    )
  }

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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Windows Ad Kit
          </div>
          <a href="/create-campaign" style={{ ...styles.buttonSecondary, textDecoration: 'none', display: 'inline-block' }}>
            ← Create New Campaign
          </a>
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
            Your Campaign Ads
          </h1>
          <p style={{ fontSize: '18px', color: '#a0a9c0', marginBottom: '32px' }}>
            {ads.length} ad variations generated • Ready for download
          </p>
          
          <button onClick={handleDownloadAll} style={{
            ...styles.button,
            fontSize: '16px',
            padding: '16px 32px',
            borderRadius: '12px',
          }}>
            📦 Download All as ZIP
          </button>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <div style={{
            ...styles.card,
            textAlign: 'center',
            padding: '20px',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#ff6b6b', marginBottom: '8px' }}>
              {ads.length}
            </div>
            <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
              Total Ads
            </div>
          </div>
          <div style={{
            ...styles.card,
            textAlign: 'center',
            padding: '20px',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#ff6b6b', marginBottom: '8px' }}>
              {new Set(ads.map(ad => ad.angle)).size}
            </div>
            <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
              Campaign Angles
            </div>
          </div>
          <div style={{
            ...styles.card,
            textAlign: 'center',
            padding: '20px',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#ff6b6b', marginBottom: '8px' }}>
              {new Set(ads.map(ad => ad.size)).size}
            </div>
            <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
              Ad Sizes
            </div>
          </div>
          <div style={{
            ...styles.card,
            textAlign: 'center',
            padding: '20px',
          }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#ff6b6b', marginBottom: '8px' }}>
              2x
            </div>
            <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
              Export Quality
            </div>
          </div>
        </div>

        {/* Ad Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        }}>
          {ads.map((ad) => (
            <div key={ad.id} style={styles.card}>
              {/* Ad Preview */}
              <div style={{
                aspectRatio: ad.size === '1x1' ? '1/1' : ad.size === '9x16' ? '9/16' : '16/9',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#333',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {sizeLabels[ad.size as keyof typeof sizeLabels]}
                </div>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                    {ad.slots.slot_headline}
                  </h3>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px' }}>
                    {ad.slots.slot_subhead}
                  </p>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    display: 'inline-block',
                  }}>
                    {ad.slots.slot_cta}
                  </div>
                </div>
              </div>

              {/* Ad Details */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
                    {angleLabels[ad.angle as keyof typeof angleLabels]}
                  </h3>
                  <span style={{
                    background: 'rgba(255, 107, 107, 0.2)',
                    color: '#ff6b6b',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    {ad.status}
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
                  Component: <code style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    {ad.componentKey}
                  </code>
                </div>
              </div>

              {/* Variable Preview */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#a0a9c0' }}>
                  Figma Variables:
                </h4>
                <div style={{ display: 'grid', gap: '4px', fontSize: '12px' }}>
                  {Object.entries(ad.variables).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a0a9c0' }}>{key}:</span>
                      <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleDownload(ad)}
                  style={{
                    ...styles.button,
                    flex: 1,
                  }}
                >
                  📥 Download PNG @2x
                </button>
                <button 
                  style={{
                    ...styles.buttonSecondary,
                    padding: '12px',
                  }}
                  title="View in Figma"
                >
                  🎨
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div style={{
          ...styles.card,
          textAlign: 'center',
          marginTop: '40px',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
            🚀 Next Steps
          </h2>
          <p style={{ color: '#a0a9c0', marginBottom: '24px' }}>
            Your ads are ready! Here's how to launch your campaigns:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ff6b6b' }}>
                1. Download Ads
              </h3>
              <p style={{ fontSize: '14px', color: '#a0a9c0' }}>
                Save all PNG files to your device
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ff6b6b' }}>
                2. Upload to Facebook
              </h3>
              <p style={{ fontSize: '14px', color: '#a0a9c0' }}>
                Use in Facebook Ads Manager
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ff6b6b' }}>
                3. Start Testing
              </h3>
              <p style={{ fontSize: '14px', color: '#a0a9c0' }}>
                Run A/B tests between angles
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/create-campaign" style={{ ...styles.button, textDecoration: 'none' }}>
              Create Another Campaign
            </a>
            <a href="/my-campaigns" style={{ ...styles.buttonSecondary, textDecoration: 'none' }}>
              View All Campaigns
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}