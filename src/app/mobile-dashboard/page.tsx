'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface CampaignPerformance {
  spent: number
  impressions: number
  clicks: number
  calls: number
  appointments: number
  costPerCall: number
  costPerAppointment: number
}

export default function MobileDashboardPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [isLoading, setIsLoading] = useState(true)
  const [customerData, setCustomerData] = useState<any>(null)
  const [campaignData, setCampaignData] = useState<any>(null)
  const [performance, setPerformance] = useState<CampaignPerformance>({
    spent: 0,
    impressions: 0,
    clicks: 0,
    calls: 0,
    appointments: 0,
    costPerCall: 0,
    costPerAppointment: 0
  })
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (sessionId) {
      fetchDashboardData()
    } else {
      // Demo data for showcase
      setCustomerData({ businessName: "Bob's Windows", city: "Austin" })
      setPerformance({
        spent: 187.45,
        impressions: 12847,
        clicks: 342,
        calls: 23,
        appointments: 8,
        costPerCall: 8.15,
        costPerAppointment: 23.43
      })
      setRecentLeads([
        { name: "Sarah Johnson", phone: "(512) 555-0123", source: "Financing Focus", time: "23 min ago", value: "$8,500" },
        { name: "Mike Chen", phone: "(512) 555-0456", source: "Energy Savings", time: "1 hr ago", value: "$12,200" },
        { name: "Jennifer Davis", phone: "(512) 555-0789", source: "Local Trust", time: "3 hrs ago", value: "$6,800" }
      ])
      setIsLoading(false)
    }
  }, [sessionId])

  const fetchDashboardData = async () => {
    try {
      // Fetch customer and campaign data
      const [customerResponse, campaignResponse] = await Promise.all([
        fetch(`/api/customer?session_id=${sessionId}`),
        fetch(`/api/meta/upload-campaign?session_id=${sessionId}`)
      ])

      if (customerResponse.ok) {
        const customerData = await customerResponse.json()
        setCustomerData(customerData.customer)
      }

      if (campaignResponse.ok) {
        const campaignData = await campaignResponse.json()
        setCampaignData(campaignData.campaigns?.[0])
        
        // Simulate performance data based on campaign
        if (campaignData.campaigns?.length > 0) {
          setPerformance({
            spent: Math.floor(Math.random() * 300) + 50,
            impressions: Math.floor(Math.random() * 15000) + 5000,
            clicks: Math.floor(Math.random() * 500) + 100,
            calls: Math.floor(Math.random() * 30) + 5,
            appointments: Math.floor(Math.random() * 15) + 2,
            costPerCall: Math.random() * 20 + 5,
            costPerAppointment: Math.random() * 40 + 15
          })
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmergencyAction = async (action: string) => {
    try {
      const response = await fetch('/api/meta/emergency-controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sessionId,
          campaignId: campaignData?.meta_campaign_id
        })
      })

      if (response.ok) {
        alert(`Campaign ${action} successful!`)
        fetchDashboardData() // Refresh data
      } else {
        alert(`Failed to ${action} campaign`)
      }
    } catch (error) {
      console.error('Emergency action error:', error)
      alert(`Error: ${action} failed`)
    }
  }

  const styles = {
    container: {
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
    },
    header: {
      background: 'linear-gradient(180deg, #1a1f3a 0%, #0a0e27 100%)',
      padding: '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 1000,
    },
    card: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '16px',
    },
    button: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 20px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    emergencyButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
    },
    successButton: {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      width: '100%',
    },
    tab: {
      flex: 1,
      textAlign: 'center' as const,
      padding: '12px 8px',
      fontSize: '14px',
      fontWeight: 600,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    activeTab: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
    },
    inactiveTab: {
      background: 'transparent',
      color: '#a0a9c0',
    },
  }

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Loading dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Windows Ad Kit
          </div>
          <div style={{ 
            background: campaignData?.status === 'ACTIVE' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {campaignData?.status === 'ACTIVE' ? '🟢 LIVE' : '⏸️ PAUSED'}
          </div>
        </div>
        
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
          {customerData?.businessName || "Your Campaign"}
        </div>
        <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
          {customerData?.city || "Dashboard"}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '16px', 
        background: 'rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {[
          { id: 'overview', icon: '📊', label: 'Overview' },
          { id: 'leads', icon: '📞', label: 'Leads' },
          { id: 'controls', icon: '🎛️', label: 'Controls' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab)
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Today's Performance */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
                📈 Today's Performance
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#ff6b6b' }}>
                    ${performance.spent.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#a0a9c0' }}>Spent</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#22c55e' }}>
                    {performance.calls}
                  </div>
                  <div style={{ fontSize: '12px', color: '#a0a9c0' }}>Calls</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#667eea' }}>
                    {performance.appointments}
                  </div>
                  <div style={{ fontSize: '12px', color: '#a0a9c0' }}>Appointments</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#f59e0b' }}>
                    ${performance.costPerCall.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#a0a9c0' }}>Cost/Call</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600, marginBottom: '4px' }}>
                  💡 Performance Status
                </div>
                <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
                  {performance.calls > 5 ? 'Strong performance! Your ads are generating quality leads.' : 
                   performance.calls > 2 ? 'Good start! Campaign is gaining momentum.' :
                   'Early stage - give it 24-48 hours to optimize.'}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                📊 Quick Stats
              </h3>
              
              <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Impressions:</span>
                  <span style={{ fontWeight: 600 }}>{performance.impressions.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Clicks:</span>
                  <span style={{ fontWeight: 600 }}>{performance.clicks}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Click Rate:</span>
                  <span style={{ fontWeight: 600 }}>{((performance.clicks / performance.impressions) * 100).toFixed(2)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Call Rate:</span>
                  <span style={{ fontWeight: 600 }}>{((performance.calls / performance.clicks) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <>
            <div style={styles.card}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
                📞 Recent Leads
              </h3>
              
              {recentLeads.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {recentLeads.map((lead, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                            {lead.name}
                          </div>
                          <div style={{ fontSize: '14px', color: '#ff6b6b', fontWeight: 600 }}>
                            {lead.phone}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '12px', color: '#a0a9c0' }}>
                            {lead.time}
                          </div>
                          <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600 }}>
                            {lead.value}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#a0a9c0' }}>
                          From: {lead.source}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a
                            href={`tel:${lead.phone}`}
                            style={{
                              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            📞 Call
                          </a>
                          <button
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#a0a9c0',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            ✅ Mark
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#a0a9c0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📞</div>
                  <div>No leads yet</div>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>
                    Leads will appear here when customers call or submit forms
                  </div>
                </div>
              )}
            </div>

            {/* Lead Actions */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                🎯 Lead Management
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <button style={styles.button}>
                  📋 View All Leads
                </button>
                <button style={styles.button}>
                  📊 Export Lead List
                </button>
                <button style={styles.button}>
                  🔔 Set Call Alerts
                </button>
              </div>
            </div>
          </>
        )}

        {/* Controls Tab */}
        {activeTab === 'controls' && (
          <>
            {/* Emergency Controls */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
                🚨 Emergency Controls
              </h3>
              
              <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                {campaignData?.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleEmergencyAction('pause')}
                    style={styles.emergencyButton}
                  >
                    ⏸️ Pause Campaign
                  </button>
                ) : (
                  <button
                    onClick={() => handleEmergencyAction('resume')}
                    style={styles.successButton}
                  >
                    ▶️ Resume Campaign
                  </button>
                )}
                
                <button
                  onClick={() => handleEmergencyAction('emergency_stop')}
                  style={styles.emergencyButton}
                >
                  🛑 Emergency Stop
                </button>
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px'
              }}>
                <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: '8px' }}>
                  ⚠️ Emergency Controls
                </div>
                <div style={{ color: '#a0a9c0' }}>
                  Pause: Stops ads immediately but preserves settings<br/>
                  Emergency Stop: Pauses and reduces budget to minimum
                </div>
              </div>
            </div>

            {/* Budget Controls */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                💰 Budget Controls
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#a0a9c0' }}>Current Daily Budget:</span>
                  <span style={{ fontWeight: 600 }}>${(campaignData?.daily_budget / 100 || 50).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#a0a9c0' }}>Today's Spend:</span>
                  <span style={{ fontWeight: 600 }}>${performance.spent.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#a0a9c0' }}>Remaining Today:</span>
                  <span style={{ fontWeight: 600, color: '#22c55e' }}>
                    ${Math.max(0, (campaignData?.daily_budget / 100 || 50) - performance.spent).toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <button
                  onClick={() => {
                    const newBudget = prompt('Enter new daily budget:', String(campaignData?.daily_budget / 100 || 50))
                    if (newBudget && !isNaN(Number(newBudget))) {
                      handleEmergencyAction('adjust_budget')
                    }
                  }}
                  style={styles.button}
                >
                  📊 Adjust Budget
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                ⚡ Quick Actions
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <a
                  href="https://adsmanager.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...styles.button,
                    textDecoration: 'none'
                  }}
                >
                  📊 Open Meta Ads Manager
                </a>
                <button style={styles.button}>
                  📧 Email Daily Report
                </button>
                <a
                  href="mailto:support@windowadkit.com"
                  style={{
                    ...styles.button,
                    textDecoration: 'none'
                  }}
                >
                  💬 Contact Support
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}