'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CampaignSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const campaignId = searchParams.get('campaign_id')
  const skipMeta = searchParams.get('skip_meta') === 'true'
  
  const [customerData, setCustomerData] = useState<any>(null)
  const [campaignData, setCampaignData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchData()
    }
  }, [sessionId])

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/customer?session_id=${sessionId}`)
      const data = await response.json()
      
      if (response.ok) {
        setCustomerData(data.customer)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadAdAssets = () => {
    // Create a mock download for demo purposes
    const adFiles = [
      'financing-focus-1x1.png',
      'financing-focus-9x16.png', 
      'energy-savings-1x1.png',
      'energy-savings-9x16.png',
      'local-trust-1x1.png',
      'local-trust-9x16.png'
    ]
    
    alert(`📁 Your ad assets would include:\n\n${adFiles.join('\n')}\n\n+ Setup guide + Campaign templates`)
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
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '32px',
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
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      marginBottom: '12px',
    },
    buttonSecondary: {
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      color: '#a0a9c0',
      borderRadius: '12px',
      padding: '16px 32px',
      fontSize: '16px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
    },
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.section}>
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
              Loading your campaign results...
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
            Campaign Ready!
          </div>
        </div>
      </nav>

      <div style={styles.section}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {skipMeta ? '🎉' : '🚀'}
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {skipMeta ? '🎯 Campaign Assets Ready!' : '🚀 Campaign Launched!'}
          </h1>
          <p style={{ fontSize: '18px', color: '#a0a9c0', marginBottom: '32px' }}>
            {skipMeta 
              ? `${customerData?.business_name || 'Your'} campaign assets have been generated and are ready for download!`
              : `${customerData?.business_name || 'Your'} campaign is now live in Meta Ads Manager with safety controls enabled.`
            }
          </p>
        </div>

        {skipMeta ? (
          // Manual Setup Flow
          <>
            {/* Download Assets Card */}
            <div style={styles.card}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
                📁 Download Your Campaign Assets
              </h2>
              
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid #22c55e',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#22c55e' }}>
                  🎨 Your Custom Ad Package Includes:
                </h3>
                <div style={{ display: 'grid', gap: '12px', fontSize: '16px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span><strong>6 Custom Ad Creatives</strong> - 3 strategic angles, 2 sizes each</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span><strong>Complete Setup Guide</strong> - Step-by-step Meta Ads Manager tutorial</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span><strong>Targeting Templates</strong> - Pre-configured audience settings</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span><strong>Budget Calculator</strong> - Recommended daily spend & duration</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span><strong>Performance Checklist</strong> - What to monitor & optimize</span>
                  </div>
                </div>
              </div>

              <button onClick={downloadAdAssets} style={styles.button}>
                📥 Download Campaign Package (12 Files)
              </button>
            </div>

            {/* Setup Guide Card */}
            <div style={styles.card}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
                🚀 Quick Setup Guide
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#ff6b6b' }}>
                  📋 Next Steps (Takes 15 minutes):
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { step: 1, title: 'Download Your Package', desc: 'Get all assets and setup guide above' },
                    { step: 2, title: 'Open Meta Ads Manager', desc: 'Go to business.facebook.com and log in' },
                    { step: 3, title: 'Create New Campaign', desc: 'Follow the step-by-step guide included' },
                    { step: 4, title: 'Upload Your Ad Creatives', desc: 'Use the 6 custom ads we created for you' },
                    { step: 5, title: 'Set Budget & Launch', desc: 'Start with $50/day for 7 days (recommended)' }
                  ].map((item) => (
                    <div key={item.step} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'white',
                        flexShrink: 0,
                      }}>
                        {item.step}
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '2px solid rgba(255, 107, 107, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#ff6b6b' }}>
                  💡 Pro Tip
                </h4>
                <p style={{ fontSize: '14px', color: '#a0a9c0', margin: 0 }}>
                  Start with PAUSED campaigns and review everything before going live. 
                  Our setup guide includes safety checklists to prevent overspending.
                </p>
              </div>
            </div>
          </>
        ) : (
          // Automated Setup Flow
          <div style={styles.card}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
              🎯 Campaign Successfully Launched!
            </h2>
            
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#22c55e' }}>
                ✅ Your campaign is now LIVE in Meta Ads Manager
              </h3>
              {campaignId && (
                <p style={{ fontSize: '14px', color: '#a0a9c0', marginBottom: '16px' }}>
                  Campaign ID: {campaignId}
                </p>
              )}
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px', textAlign: 'left' }}>
                <div>• 🎯 <strong>3 Strategic Ad Angles</strong> targeting your ideal customers</div>
                <div>• 💰 <strong>Budget Safety Controls</strong> preventing overspend</div>
                <div>• 📊 <strong>Performance Monitoring</strong> with daily email reports</div>
                <div>• ⏸️ <strong>Auto-Pause Protection</strong> if cost per lead exceeds limits</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <a href="https://business.facebook.com/adsmanager" target="_blank" style={styles.button}>
                📊 View in Meta Ads Manager
              </a>
              <a href={`/my-campaign?session_id=${sessionId}`} style={styles.buttonSecondary}>
                📈 View Performance Dashboard
              </a>
            </div>
          </div>
        )}

        {/* What's Next Card */}
        <div style={styles.card}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>
            📈 What to Expect
          </h2>
          
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                📊 Expected Performance (First 7 Days):
              </h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#a0a9c0' }}>
                <div>• <strong>2,000-4,000 people</strong> will see your ads daily</div>
                <div>• <strong>15-30 phone calls</strong> from interested homeowners</div>
                <div>• <strong>3-8 qualified appointments</strong> booked</div>
                <div>• <strong>$25-$65 average</strong> cost per lead</div>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#ff6b6b' }}>
                📞 Your Next Actions:
              </h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: '#a0a9c0' }}>
                <div>• Check your email for daily performance reports</div>
                <div>• Answer phone calls promptly (leads are hot!)</div>
                <div>• Book appointments within 24 hours of contact</div>
                <div>• Monitor your dashboard for optimization opportunities</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '2px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ff6b6b' }}>
              🆘 Need Help?
            </h4>
            <p style={{ fontSize: '14px', color: '#a0a9c0', marginBottom: '16px' }}>
              Our team monitors all campaigns and will reach out if we notice any issues.
            </p>
            <a href="mailto:support@windowadkit.com" style={{
              ...styles.buttonSecondary,
              width: 'auto',
              display: 'inline-flex'
            }}>
              📧 Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}