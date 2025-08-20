'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  city: string
  address?: string
  
  // Source tracking
  source: string
  campaignName?: string
  adName?: string
  
  // Project details
  projectType?: string
  windowCount?: number
  doorCount?: number
  estimatedBudget?: string
  timeframe?: string
  primaryMotivation?: string
  
  // Lead management
  score: number
  status: string
  qualificationStatus: string
  createdAt: string
  lastContactedAt?: string
  nextFollowUpAt?: string
  
  // Interactions
  interactions: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    response?: string
  }>
  
  notes: Array<{
    id: string
    content: string
    timestamp: string
    author: string
  }>
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'scheduled'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      // TODO: Replace with actual API call
      const mockLeads: Lead[] = [
        {
          id: 'lead_1737645123_abc123',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '(555) 123-4567',
          city: 'Austin',
          address: '123 Oak Street',
          source: 'facebook',
          campaignName: 'Winter Special',
          adName: 'Energy Savings Ad',
          projectType: 'replacement',
          windowCount: 8,
          doorCount: 1,
          estimatedBudget: '$5000-8000',
          timeframe: 'asap',
          primaryMotivation: 'energy_savings',
          score: 85,
          status: 'new',
          qualificationStatus: 'hot',
          createdAt: '2025-01-20T10:30:00Z',
          nextFollowUpAt: '2025-01-20T10:35:00Z',
          interactions: [
            {
              id: 'int_1',
              type: 'form_submission',
              message: 'Lead submitted contact form',
              timestamp: '2025-01-20T10:30:00Z'
            }
          ],
          notes: []
        },
        {
          id: 'lead_1737645456_def456',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '(555) 987-6543',
          city: 'Austin',
          source: 'google',
          campaignName: 'Google Search',
          projectType: 'new_construction',
          windowCount: 12,
          estimatedBudget: '$10000+',
          timeframe: '1-3_months',
          primaryMotivation: 'aesthetics',
          score: 75,
          status: 'contacted',
          qualificationStatus: 'warm',
          createdAt: '2025-01-19T14:15:00Z',
          lastContactedAt: '2025-01-19T15:00:00Z',
          nextFollowUpAt: '2025-01-21T14:15:00Z',
          interactions: [
            {
              id: 'int_2',
              type: 'phone_call',
              message: 'Initial contact call made',
              timestamp: '2025-01-19T15:00:00Z',
              response: 'Interested, will discuss with spouse'
            }
          ],
          notes: [
            {
              id: 'note_1',
              content: 'Building new home, needs quote by end of month',
              timestamp: '2025-01-19T15:05:00Z',
              author: 'contractor'
            }
          ]
        }
      ]
      
      setLeads(mockLeads)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLoading(false)
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
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    card: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '16px',
    },
    button: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
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
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
    },
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#3b82f6'
    return '#ef4444'
  }

  const getQualificationBadge = (status: string) => {
    const colors = {
      hot: '#ef4444',
      warm: '#f59e0b',
      qualified: '#3b82f6',
      needs_qualification: '#6b7280'
    }
    return {
      background: colors[status as keyof typeof colors] || '#6b7280',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'capitalize' as const
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (activeTab === 'all') return true
    return lead.status === activeTab
  })

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.section, textAlign: 'center', paddingTop: '200px' }}>
          <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Loading leads...
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Windows Ad Kit
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/my-campaigns" style={{ color: '#a0a9c0', textDecoration: 'none', fontSize: '14px' }}>← Back to Dashboard</a>
            <div style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {leads.length} Leads
            </div>
          </div>
        </div>
      </nav>

      <div style={styles.section}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Lead Inspector
          </h1>
          <p style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Manage and convert your leads into appointments
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Total Leads', value: leads.length, color: '#3b82f6' },
            { label: 'Hot Leads', value: leads.filter(l => l.qualificationStatus === 'hot').length, color: '#ef4444' },
            { label: 'Scheduled', value: leads.filter(l => l.status === 'scheduled').length, color: '#22c55e' },
            { label: 'Avg Score', value: Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length || 0), color: '#f59e0b' },
          ].map((stat, index) => (
            <div key={index} style={{
              ...styles.card,
              textAlign: 'center',
              padding: '16px',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: stat.color, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Leads' },
              { key: 'new', label: 'New' },
              { key: 'contacted', label: 'Contacted' },
              { key: 'qualified', label: 'Qualified' },
              { key: 'scheduled', label: 'Scheduled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  ...(activeTab === tab.key ? styles.button : styles.buttonSecondary),
                  margin: 0,
                }}
              >
                {tab.label} ({leads.filter(l => tab.key === 'all' || l.status === tab.key).length})
              </button>
            ))}
          </div>
        </div>

        {/* Leads List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedLead ? '1fr 400px' : '1fr',
          gap: '24px',
        }}>
          {/* Lead Cards */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                style={{
                  ...styles.card,
                  cursor: 'pointer',
                  border: selectedLead?.id === lead.id ? '2px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px', color: '#ffffff' }}>
                      {lead.name}
                    </h3>
                    <div style={{ color: '#a0a9c0', fontSize: '14px', marginBottom: '8px' }}>
                      📞 {lead.phone} • 📍 {lead.city}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={getQualificationBadge(lead.qualificationStatus)}>
                        {lead.qualificationStatus.replace('_', ' ')}
                      </span>
                      <span style={{
                        background: `${getScoreColor(lead.score)}20`,
                        color: getScoreColor(lead.score),
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        Score: {lead.score}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#a0a9c0', fontSize: '12px' }}>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                      {lead.estimatedBudget || 'Budget TBD'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#a0a9c0' }}>Source:</span>
                    <span style={{ color: '#ffffff', marginLeft: '8px' }}>{lead.source}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a9c0' }}>Project:</span>
                    <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                      {lead.windowCount ? `${lead.windowCount} windows` : 'Details needed'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a9c0' }}>Timeline:</span>
                    <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                      {lead.timeframe?.replace('_', ' ') || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a9c0' }}>Next Follow-up:</span>
                    <span style={{ color: lead.nextFollowUpAt ? '#ff6b6b' : '#a0a9c0', marginLeft: '8px' }}>
                      {lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleDateString() : 'Not scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredLeads.length === 0 && (
              <div style={{
                ...styles.card,
                textAlign: 'center',
                padding: '40px',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No leads found</h3>
                <p style={{ color: '#a0a9c0' }}>
                  {activeTab === 'all' 
                    ? 'Your leads will appear here when your campaigns start generating responses.'
                    : `No leads with status "${activeTab}".`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Lead Detail Sidebar */}
          {selectedLead && (
            <div style={{
              ...styles.card,
              position: 'sticky',
              top: '100px',
              height: 'fit-content',
              maxHeight: 'calc(100vh - 120px)',
              overflow: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Lead Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#a0a9c0',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Contact Info</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  <div><strong>Name:</strong> {selectedLead.name}</div>
                  <div><strong>Phone:</strong> {selectedLead.phone}</div>
                  {selectedLead.email && <div><strong>Email:</strong> {selectedLead.email}</div>}
                  <div><strong>Location:</strong> {selectedLead.city}</div>
                  {selectedLead.address && <div><strong>Address:</strong> {selectedLead.address}</div>}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Project Details</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  {selectedLead.projectType && <div><strong>Type:</strong> {selectedLead.projectType}</div>}
                  {selectedLead.windowCount && <div><strong>Windows:</strong> {selectedLead.windowCount}</div>}
                  {selectedLead.doorCount && <div><strong>Doors:</strong> {selectedLead.doorCount}</div>}
                  {selectedLead.estimatedBudget && <div><strong>Budget:</strong> {selectedLead.estimatedBudget}</div>}
                  {selectedLead.timeframe && <div><strong>Timeline:</strong> {selectedLead.timeframe.replace('_', ' ')}</div>}
                  {selectedLead.primaryMotivation && <div><strong>Motivation:</strong> {selectedLead.primaryMotivation.replace('_', ' ')}</div>}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Lead Source</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                  <div><strong>Source:</strong> {selectedLead.source}</div>
                  {selectedLead.campaignName && <div><strong>Campaign:</strong> {selectedLead.campaignName}</div>}
                  {selectedLead.adName && <div><strong>Ad:</strong> {selectedLead.adName}</div>}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Actions</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <button style={styles.button}>📞 Call Lead</button>
                  <button style={styles.button}>📱 Send SMS</button>
                  <button style={styles.button}>📧 Send Email</button>
                  <button style={styles.button}>📅 Schedule Appointment</button>
                  <button style={styles.buttonSecondary}>✏️ Add Note</button>
                </div>
              </div>

              {selectedLead.interactions.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Recent Interactions</h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {selectedLead.interactions.map((interaction) => (
                      <div key={interaction.id} style={{
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                          {interaction.type.replace('_', ' ')}
                        </div>
                        <div style={{ color: '#a0a9c0' }}>
                          {interaction.message}
                        </div>
                        {interaction.response && (
                          <div style={{ color: '#22c55e', marginTop: '4px' }}>
                            Response: {interaction.response}
                          </div>
                        )}
                        <div style={{ color: '#a0a9c0', fontSize: '12px', marginTop: '4px' }}>
                          {new Date(interaction.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}