'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Mock data for development - in production this would come from the database
const mockCustomer = {
  business_name: "Bob's Windows & Doors",
  city: "Dallas",
  email: "bob@bobswindows.com",
  status: "active"
}

const mockCampaigns = [
  {
    id: "1",
    name: "Winter Special",
    type: "winter_special",
    status: "active",
    budget: 1500,
    appointments_booked: 23,
    cost_per_appointment: 47,
    revenue_generated: 34500,
    launches_at: "2025-01-20T10:00:00Z",
    created_at: "2025-01-17T15:30:00Z"
  }
]

const mockAppointments = [
  {
    id: "1",
    lead_name: "Sarah Johnson",
    lead_phone: "(214) 555-0123",
    appointment_date: "2025-01-22T14:00:00Z",
    appointment_type: "estimate",
    status: "scheduled",
    estimated_value: 2500,
    campaign_name: "Winter Special"
  },
  {
    id: "2", 
    lead_name: "Mike Chen",
    lead_phone: "(214) 555-0456",
    appointment_date: "2025-01-20T10:30:00Z",
    appointment_type: "consultation",
    status: "completed",
    estimated_value: 1800,
    actual_value: 1950,
    campaign_name: "Winter Special"
  }
]

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

interface AppointmentData {
  id: string
  leadName: string
  leadEmail?: string
  leadPhone: string
  appointmentDate: string
  appointmentType: string
  status: string
  estimatedValue: number
  actualValue?: number
  notes?: string
  campaignName: string
}

export default function MyCampaignsPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'appointments'>('overview')
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided. Please access this page from your purchase confirmation.')
      setIsLoading(false)
      return
    }
    
    fetchPortalData(sessionId)
  }, [sessionId])

  const fetchPortalData = async (sessionId: string) => {
    try {
      console.log('🔍 Fetching portal data for session:', sessionId)
      
      const response = await fetch(`/api/portal?session_id=${sessionId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to load your data')
        return
      }

      console.log('✅ Portal data loaded successfully')
      setCustomer(data.customer)
      setCampaigns(data.campaigns || [])
      setAppointments(data.appointments || [])

    } catch (error) {
      console.error('❌ Error fetching portal data:', error)
      setError('Unable to load your data. Please check your internet connection.')
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
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Loading your campaign data...</h1>
          <p style={{ color: '#a0a9c0' }}>Please wait while we retrieve your information.</p>
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
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#ff6b6b' }}>
            Unable to Load Your Dashboard
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#a0a9c0' }}>Welcome back, {customer?.businessName || 'Contractor'}!</span>
            <a href="/leads" style={{
              color: '#a0a9c0',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              Lead Inspector
            </a>
            <a href="/pipeline" style={{
              color: '#a0a9c0',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              Pipeline
            </a>
            <a href="/analytics" style={{
              color: '#a0a9c0',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              Analytics
            </a>
            <a href="/create-campaign" style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
            }}>
              + New Campaign
            </a>
            <div style={{ 
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
              color: 'white',
              padding: '8px 16px', 
              borderRadius: '20px', 
              fontWeight: 700,
              fontSize: '14px'
            }}>
              Active
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'campaigns', label: 'My Campaigns' },
              { key: 'appointments', label: 'Appointments' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab.key ? '#ff6b35' : '#94a3b8',
                  padding: '20px 30px',
                  fontSize: '1.1rem',
                  fontWeight: activeTab === tab.key ? 700 : 400,
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.key ? '3px solid #ff6b35' : '3px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '30px', 
              marginBottom: '50px' 
            }}>
              <div style={{ 
                background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ff6b6b', marginBottom: '10px' }}>
                  {campaigns.reduce((total, campaign) => total + campaign.appointmentsBooked, 0)}
                </div>
                <div style={{ color: '#a0a9c0' }}>Appointments Booked</div>
              </div>

              <div style={{ 
                background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#22c55e', marginBottom: '10px' }}>
                  ${campaigns.length > 0 ? Math.round(campaigns.reduce((total, campaign) => total + campaign.costPerAppointment, 0) / campaigns.length) : 0}
                </div>
                <div style={{ color: '#a0a9c0' }}>Avg Cost Per Appointment</div>
              </div>

              <div style={{ 
                background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#22c55e', marginBottom: '10px' }}>
                  ${campaigns.reduce((total, campaign) => total + campaign.revenueGenerated, 0).toLocaleString()}
                </div>
                <div style={{ color: '#a0a9c0' }}>Total Revenue Generated</div>
              </div>

              <div style={{ 
                background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ff6b6b', marginBottom: '10px' }}>
                  {campaigns.filter(campaign => campaign.status === 'active').length}
                </div>
                <div style={{ color: '#a0a9c0' }}>Active Campaigns</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ 
              background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700,
                marginBottom: '30px', 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent'
              }}>
                Recent Activity
              </h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                {appointments.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#a0a9c0',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                    <h3 style={{ marginBottom: '8px', color: '#ffffff' }}>No appointments yet</h3>
                    <p>Your appointments will appear here once your campaign is active.</p>
                  </div>
                ) : (
                  appointments
                    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                    .slice(0, 3)
                    .map(appointment => (
                      <div key={appointment.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '25px', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                            {appointment.status === 'completed' ? 'Appointment completed' : 
                             appointment.status === 'scheduled' ? 'New appointment scheduled' : 
                             'Appointment updated'}
                          </div>
                          <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
                            {appointment.leadName} - {appointment.appointmentType} • {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ 
                          color: appointment.status === 'completed' ? '#22c55e' : '#ff6b6b', 
                          fontWeight: 700 
                        }}>
                          ${(appointment.actualValue || appointment.estimatedValue).toLocaleString()} {appointment.status === 'completed' ? 'revenue' : 'potential'}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'campaigns' && (
          <div style={{ 
            background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 900,
              marginBottom: '30px', 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent'
            }}>
              My Campaigns
            </h2>
            
            {campaigns.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 40px', 
                color: '#a0a9c0',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
                <h3 style={{ marginBottom: '12px', color: '#ffffff', fontSize: '24px' }}>No campaigns yet</h3>
                <p style={{ fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
                  Your "Winter Special" campaign will appear here once it's been set up by our team within 72 hours.
                </p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '30px', 
                  borderRadius: '16px', 
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ margin: 0, marginBottom: '10px', fontSize: '24px', color: '#ffffff' }}>
                        {campaign.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <div style={{ 
                          display: 'inline-block',
                          background: campaign.status === 'active' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 
                                     campaign.status === 'draft' ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' : '#6b7280',
                          color: 'white',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 700,
                          textTransform: 'capitalize'
                        }}>
                          {campaign.status}
                        </div>
                        {campaign.hoursUntilLaunch > 0 && (
                          <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
                            Launches in {campaign.hoursUntilLaunch}h
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#a0a9c0', fontSize: '14px' }}>Monthly Budget</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>${campaign.budget.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px' 
                  }}>
                    <div>
                      <div style={{ color: '#a0a9c0', fontSize: '14px' }}>Appointments Booked</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>{campaign.appointmentsBooked}</div>
                    </div>
                    <div>
                      <div style={{ color: '#a0a9c0', fontSize: '14px' }}>Cost Per Appointment</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff' }}>${campaign.costPerAppointment}</div>
                    </div>
                    <div>
                      <div style={{ color: '#a0a9c0', fontSize: '14px' }}>Revenue Generated</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>${campaign.revenueGenerated.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div style={{ 
            background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 900,
              marginBottom: '30px', 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent'
            }}>
              Your Appointments
            </h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {appointments.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 40px', 
                  color: '#a0a9c0',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>📅</div>
                  <h3 style={{ marginBottom: '12px', color: '#ffffff', fontSize: '24px' }}>No appointments yet</h3>
                  <p style={{ fontSize: '16px', maxWidth: '400px', margin: '0 auto' }}>
                    Your appointments will appear here once your campaign is active and generating leads.
                  </p>
                </div>
              ) : (
                appointments
                  .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                  .map((appointment) => (
                    <div key={appointment.id} style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      padding: '25px', 
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '20px', color: '#ffffff' }}>
                            {appointment.leadName}
                          </h3>
                          <div style={{ color: '#a0a9c0', marginBottom: '12px', fontSize: '14px' }}>
                            📞 {appointment.leadPhone} • 📅 {new Date(appointment.appointmentDate).toLocaleDateString()} at {new Date(appointment.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ 
                              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', 
                              color: 'white', 
                              padding: '6px 16px', 
                              borderRadius: '20px', 
                              fontSize: '14px', 
                              fontWeight: 700,
                              textTransform: 'capitalize',
                              marginRight: '12px'
                            }}>
                              {appointment.appointmentType}
                            </span>
                            <span style={{ 
                              background: appointment.status === 'completed' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 
                                         appointment.status === 'scheduled' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 
                                         '#6b7280',
                              color: 'white',
                              padding: '6px 16px', 
                              borderRadius: '20px', 
                              fontSize: '14px', 
                              fontWeight: 700,
                              textTransform: 'capitalize'
                            }}>
                              {appointment.status}
                            </span>
                          </div>
                          <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
                            From: {appointment.campaignName} campaign
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
                            {appointment.status === 'completed' ? 'Final Value' : 'Estimated Value'}
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
                            ${(appointment.actualValue || appointment.estimatedValue).toLocaleString()}
                          </div>
                          {appointment.leadEmail && (
                            <div style={{ color: '#a0a9c0', fontSize: '12px', marginTop: '4px' }}>
                              📧 {appointment.leadEmail}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}