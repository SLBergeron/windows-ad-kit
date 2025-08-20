'use client'

import { useState, useEffect } from 'react'

interface PipelineStage {
  id: string
  name: string
  color: string
  description: string
  leads: Lead[]
}

interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  city: string
  score: number
  qualificationStatus: string
  estimatedValue: number
  source: string
  daysInStage: number
  lastInteraction: string
  nextFollowUp?: string
  stageId: string
}

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [showStageModal, setShowStageModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPipelineData()
  }, [])

  const fetchPipelineData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockPipeline: PipelineStage[] = [
        {
          id: 'new',
          name: 'New Leads',
          color: '#3b82f6',
          description: 'Fresh leads requiring initial contact',
          leads: [
            {
              id: 'lead_1',
              name: 'Sarah Johnson',
              phone: '(555) 123-4567',
              email: 'sarah@email.com',
              city: 'Austin',
              score: 85,
              qualificationStatus: 'hot',
              estimatedValue: 8500,
              source: 'facebook',
              daysInStage: 0,
              lastInteraction: '2025-01-20T10:30:00Z',
              nextFollowUp: '2025-01-20T10:35:00Z',
              stageId: 'new'
            },
            {
              id: 'lead_2',
              name: 'Mike Wilson',
              phone: '(555) 234-5678',
              city: 'Austin',
              score: 72,
              qualificationStatus: 'warm',
              estimatedValue: 6200,
              source: 'google',
              daysInStage: 1,
              lastInteraction: '2025-01-19T15:45:00Z',
              stageId: 'new'
            }
          ]
        },
        {
          id: 'contacted',
          name: 'Contacted',
          color: '#f59e0b',
          description: 'Initial contact made, awaiting response',
          leads: [
            {
              id: 'lead_3',
              name: 'Jennifer Davis',
              phone: '(555) 345-6789',
              email: 'jen.davis@email.com',
              city: 'Round Rock',
              score: 78,
              qualificationStatus: 'warm',
              estimatedValue: 9200,
              source: 'referral',
              daysInStage: 2,
              lastInteraction: '2025-01-18T14:20:00Z',
              nextFollowUp: '2025-01-21T09:00:00Z',
              stageId: 'contacted'
            }
          ]
        },
        {
          id: 'qualified',
          name: 'Qualified',
          color: '#8b5cf6',
          description: 'Qualified leads ready for appointment',
          leads: [
            {
              id: 'lead_4',
              name: 'Robert Chen',
              phone: '(555) 456-7890',
              email: 'robert.chen@email.com',
              city: 'Cedar Park',
              score: 92,
              qualificationStatus: 'hot',
              estimatedValue: 12400,
              source: 'google',
              daysInStage: 1,
              lastInteraction: '2025-01-19T11:30:00Z',
              nextFollowUp: '2025-01-20T16:00:00Z',
              stageId: 'qualified'
            },
            {
              id: 'lead_5',
              name: 'Lisa Martinez',
              phone: '(555) 567-8901',
              city: 'Pflugerville',
              score: 88,
              qualificationStatus: 'hot',
              estimatedValue: 10800,
              source: 'facebook',
              daysInStage: 0,
              lastInteraction: '2025-01-20T08:15:00Z',
              stageId: 'qualified'
            }
          ]
        },
        {
          id: 'appointment_scheduled',
          name: 'Appointment Scheduled',
          color: '#10b981',
          description: 'Appointment booked, estimate pending',
          leads: [
            {
              id: 'lead_6',
              name: 'David Thompson',
              phone: '(555) 678-9012',
              email: 'david.t@email.com',
              city: 'Austin',
              score: 95,
              qualificationStatus: 'hot',
              estimatedValue: 15600,
              source: 'referral',
              daysInStage: 3,
              lastInteraction: '2025-01-17T16:45:00Z',
              nextFollowUp: '2025-01-22T10:00:00Z',
              stageId: 'appointment_scheduled'
            }
          ]
        },
        {
          id: 'estimate_provided',
          name: 'Estimate Provided',
          color: '#f97316',
          description: 'Quote sent, awaiting decision',
          leads: [
            {
              id: 'lead_7',
              name: 'Amanda Foster',
              phone: '(555) 789-0123',
              city: 'Leander',
              score: 89,
              qualificationStatus: 'hot',
              estimatedValue: 11200,
              source: 'google',
              daysInStage: 5,
              lastInteraction: '2025-01-15T13:30:00Z',
              nextFollowUp: '2025-01-21T14:00:00Z',
              stageId: 'estimate_provided'
            }
          ]
        },
        {
          id: 'closed_won',
          name: 'Closed Won',
          color: '#22c55e',
          description: 'Customer signed, project scheduled',
          leads: [
            {
              id: 'lead_8',
              name: 'Mark Rodriguez',
              phone: '(555) 890-1234',
              email: 'mark.r@email.com',
              city: 'Georgetown',
              score: 98,
              qualificationStatus: 'hot',
              estimatedValue: 18900,
              source: 'referral',
              daysInStage: 2,
              lastInteraction: '2025-01-18T11:00:00Z',
              stageId: 'closed_won'
            }
          ]
        }
      ]

      setPipeline(mockPipeline)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching pipeline:', error)
      setLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    
    if (!draggedLead || draggedLead.stageId === targetStageId) {
      setDraggedLead(null)
      return
    }

    // Move lead to new stage
    const updatedPipeline = pipeline.map(stage => ({
      ...stage,
      leads: stage.leads.filter(lead => lead.id !== draggedLead.id)
    }))

    const targetStageIndex = updatedPipeline.findIndex(stage => stage.id === targetStageId)
    if (targetStageIndex !== -1) {
      updatedPipeline[targetStageIndex].leads.push({
        ...draggedLead,
        stageId: targetStageId,
        daysInStage: 0
      })
    }

    setPipeline(updatedPipeline)
    setDraggedLead(null)

    // TODO: Update backend
    console.log(`Moved ${draggedLead.name} to ${targetStageId}`)
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
      maxWidth: '1600px',
      margin: '0 auto',
    },
    stageColumn: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minHeight: '500px',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    leadCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
      cursor: 'grab',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s ease',
    },
    button: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: 600,
      cursor: 'pointer',
    },
  }

  const totalPipelineValue = pipeline.reduce((total, stage) => 
    total + stage.leads.reduce((stageTotal, lead) => stageTotal + lead.estimatedValue, 0), 0
  )

  const conversionRates = pipeline.map(stage => {
    const totalLeads = pipeline.reduce((sum, s) => sum + s.leads.length, 0)
    return totalLeads > 0 ? (stage.leads.length / totalLeads * 100).toFixed(1) : '0'
  })

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.section, textAlign: 'center', paddingTop: '200px' }}>
          <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Loading pipeline...
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
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Windows Ad Kit
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/leads" style={{ color: '#a0a9c0', textDecoration: 'none', fontSize: '14px' }}>← Back to Leads</a>
            <div style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              ${totalPipelineValue.toLocaleString()} Pipeline
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
            Conversion Pipeline
          </h1>
          <p style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Drag leads between stages to track progress
          </p>
        </div>

        {/* Pipeline Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {pipeline.map((stage, index) => (
            <div key={stage.id} style={{
              background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              border: `2px solid ${stage.color}20`,
            }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: stage.color, marginBottom: '4px' }}>
                {stage.leads.length}
              </div>
              <div style={{ color: '#a0a9c0', fontSize: '12px', marginBottom: '4px' }}>
                {stage.name}
              </div>
              <div style={{ color: '#a0a9c0', fontSize: '10px' }}>
                {conversionRates[index]}% of total
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Stages */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          overflowX: 'auto',
        }}>
          {pipeline.map((stage) => (
            <div
              key={stage.id}
              style={styles.stageColumn}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: stage.color,
                    }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
                      {stage.name}
                    </h3>
                  </div>
                  <span style={{
                    background: `${stage.color}20`,
                    color: stage.color,
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}>
                    {stage.leads.length}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#a0a9c0', margin: 0 }}>
                  {stage.description}
                </p>
                <div style={{ fontSize: '12px', color: stage.color, marginTop: '4px' }}>
                  ${stage.leads.reduce((sum, lead) => sum + lead.estimatedValue, 0).toLocaleString()} value
                </div>
              </div>

              {/* Lead Cards */}
              <div style={{ flex: 1 }}>
                {stage.leads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    onClick={() => setSelectedLead(lead)}
                    style={{
                      ...styles.leadCard,
                      border: selectedLead?.id === lead.id ? `2px solid ${stage.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, margin: 0, marginBottom: '2px' }}>
                          {lead.name}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#a0a9c0' }}>
                          📞 {lead.phone}
                        </div>
                      </div>
                      <div style={{
                        background: lead.qualificationStatus === 'hot' ? '#ef444420' : 
                                   lead.qualificationStatus === 'warm' ? '#f59e0b20' : '#3b82f620',
                        color: lead.qualificationStatus === 'hot' ? '#ef4444' : 
                               lead.qualificationStatus === 'warm' ? '#f59e0b' : '#3b82f6',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}>
                        {lead.qualificationStatus}
                      </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#a0a9c0', marginBottom: '2px' }}>
                        📍 {lead.city} • 📊 Score: {lead.score}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>
                        ${lead.estimatedValue.toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#a0a9c0' }}>
                        {lead.daysInStage} days in stage
                      </div>
                      {lead.nextFollowUp && (
                        <div style={{ fontSize: '10px', color: '#ff6b6b' }}>
                          Follow-up due
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {stage.leads.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#a0a9c0',
                    fontSize: '14px',
                    border: '2px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}>
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <button style={{
            ...styles.button,
            padding: '12px 16px',
            borderRadius: '50px',
            fontSize: '14px',
          }}>
            + Add Lead
          </button>
          <button style={{
            ...styles.button,
            padding: '12px 16px',
            borderRadius: '50px',
            fontSize: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          }}>
            📊 Pipeline Report
          </button>
        </div>
      </div>
    </div>
  )
}