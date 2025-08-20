'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  overview: {
    totalLeads: number
    appointmentsBooked: number
    conversionRate: number
    averageDealSize: number
    totalRevenue: number
    costPerLead: number
    costPerAppointment: number
    roi: number
  }
  
  leadSources: Array<{
    source: string
    leads: number
    appointments: number
    revenue: number
    cost: number
    conversionRate: number
    costPerLead: number
    roi: number
  }>
  
  campaigns: Array<{
    id: string
    name: string
    status: string
    leads: number
    appointments: number
    revenue: number
    spend: number
    conversionRate: number
    costPerAppointment: number
    roi: number
  }>
  
  pipeline: Array<{
    stage: string
    count: number
    value: number
    averageDaysInStage: number
    conversionRate: number
  }>
  
  timeline: Array<{
    date: string
    leads: number
    appointments: number
    revenue: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalLeads: 127,
          appointmentsBooked: 23,
          conversionRate: 18.1,
          averageDealSize: 8450,
          totalRevenue: 194350,
          costPerLead: 47,
          costPerAppointment: 259,
          roi: 326
        },
        
        leadSources: [
          {
            source: 'Facebook Ads',
            leads: 68,
            appointments: 14,
            revenue: 118300,
            cost: 3200,
            conversionRate: 20.6,
            costPerLead: 47,
            roi: 3597
          },
          {
            source: 'Google Ads',
            leads: 43,
            appointments: 7,
            revenue: 59150,
            cost: 2150,
            conversionRate: 16.3,
            costPerLead: 50,
            roi: 2651
          },
          {
            source: 'Referrals',
            leads: 12,
            appointments: 2,
            revenue: 16900,
            cost: 0,
            conversionRate: 16.7,
            costPerLead: 0,
            roi: 999999
          },
          {
            source: 'Organic',
            leads: 4,
            appointments: 0,
            revenue: 0,
            cost: 0,
            conversionRate: 0,
            costPerLead: 0,
            roi: 0
          }
        ],
        
        campaigns: [
          {
            id: 'camp_1',
            name: 'Winter Energy Savings',
            status: 'active',
            leads: 45,
            appointments: 9,
            revenue: 76050,
            spend: 2100,
            conversionRate: 20.0,
            costPerAppointment: 233,
            roi: 3522
          },
          {
            id: 'camp_2',
            name: 'Google Search - Austin',
            status: 'active',
            leads: 23,
            appointments: 4,
            revenue: 33800,
            spend: 1150,
            conversionRate: 17.4,
            costPerAppointment: 288,
            roi: 2839
          },
          {
            id: 'camp_3',
            name: 'Facebook Homeowners 35+',
            status: 'paused',
            leads: 31,
            appointments: 6,
            revenue: 50700,
            spend: 1550,
            conversionRate: 19.4,
            costPerAppointment: 258,
            roi: 3171
          }
        ],
        
        pipeline: [
          { stage: 'New Leads', count: 15, value: 127500, averageDaysInStage: 0.5, conversionRate: 85 },
          { stage: 'Contacted', count: 12, value: 101600, averageDaysInStage: 1.2, conversionRate: 75 },
          { stage: 'Qualified', count: 9, value: 76200, averageDaysInStage: 2.1, conversionRate: 67 },
          { stage: 'Appointment Scheduled', count: 6, value: 50800, averageDaysInStage: 1.8, conversionRate: 83 },
          { stage: 'Estimate Provided', count: 5, value: 42300, averageDaysInStage: 4.2, conversionRate: 60 },
          { stage: 'Closed Won', count: 3, value: 25400, averageDaysInStage: 1.0, conversionRate: 100 }
        ],
        
        timeline: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          leads: Math.floor(Math.random() * 8) + 2,
          appointments: Math.floor(Math.random() * 3),
          revenue: Math.floor(Math.random() * 15000) + 5000
        }))
      }
      
      setAnalytics(mockAnalytics)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
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
    },
    statCard: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center' as const,
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

  if (loading || !analytics) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.section, textAlign: 'center', paddingTop: '200px' }}>
          <div style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Loading analytics...
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
            <a href="/pipeline" style={{ color: '#a0a9c0', textDecoration: 'none', fontSize: '14px' }}>← Back to Pipeline</a>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    ...(timeRange === range ? styles.button : styles.buttonSecondary),
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  {range}
                </button>
              ))}
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
            Performance Analytics
          </h1>
          <p style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Track ROI and optimize your lead generation
          </p>
        </div>

        {/* Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {[
            { label: 'Total Leads', value: analytics.overview.totalLeads, color: '#3b82f6', format: 'number' },
            { label: 'Appointments', value: analytics.overview.appointmentsBooked, color: '#22c55e', format: 'number' },
            { label: 'Conversion Rate', value: analytics.overview.conversionRate, color: '#f59e0b', format: 'percent' },
            { label: 'Avg Deal Size', value: analytics.overview.averageDealSize, color: '#22c55e', format: 'currency' },
            { label: 'Total Revenue', value: analytics.overview.totalRevenue, color: '#22c55e', format: 'currency' },
            { label: 'Cost/Lead', value: analytics.overview.costPerLead, color: '#ef4444', format: 'currency' },
            { label: 'Cost/Appointment', value: analytics.overview.costPerAppointment, color: '#ef4444', format: 'currency' },
            { label: 'ROI', value: analytics.overview.roi, color: '#8b5cf6', format: 'percent' },
          ].map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: stat.color, marginBottom: '8px' }}>
                {stat.format === 'currency' ? `$${stat.value.toLocaleString()}` :
                 stat.format === 'percent' ? `${stat.value}%` :
                 stat.value.toLocaleString()}
              </div>
              <div style={{ color: '#a0a9c0', fontSize: '14px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Lead Sources Analysis */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            Lead Source Performance
          </h2>
          <div style={styles.card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#a0a9c0' }}>Source</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#a0a9c0' }}>Leads</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#a0a9c0' }}>Appointments</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#a0a9c0' }}>Conv. Rate</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#a0a9c0' }}>Revenue</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#a0a9c0' }}>Cost/Lead</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#a0a9c0' }}>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.leadSources.map((source, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{source.source}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{source.leads}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{source.appointments}</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: source.conversionRate > 15 ? '#22c55e' : '#f59e0b' }}>
                        {source.conversionRate.toFixed(1)}%
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#22c55e' }}>
                        ${source.revenue.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {source.cost > 0 ? `$${source.costPerLead}` : 'Free'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: source.roi > 300 ? '#22c55e' : '#f59e0b' }}>
                        {source.roi > 9999 ? '∞' : `${source.roi.toFixed(0)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            Campaign Performance
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px',
          }}>
            {analytics.campaigns.map((campaign) => (
              <div key={campaign.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                    {campaign.name}
                  </h3>
                  <span style={{
                    background: campaign.status === 'active' ? '#22c55e20' : '#f59e0b20',
                    color: campaign.status === 'active' ? '#22c55e' : '#f59e0b',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize' as const,
                  }}>
                    {campaign.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ color: '#a0a9c0', fontSize: '12px' }}>Leads</div>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{campaign.leads}</div>
                  </div>
                  <div>
                    <div style={{ color: '#a0a9c0', fontSize: '12px' }}>Appointments</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>{campaign.appointments}</div>
                  </div>
                  <div>
                    <div style={{ color: '#a0a9c0', fontSize: '12px' }}>Revenue</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>
                      ${campaign.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#a0a9c0', fontSize: '12px' }}>ROI</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: campaign.roi > 300 ? '#22c55e' : '#f59e0b' }}>
                      {campaign.roi.toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
                  Conversion: {campaign.conversionRate.toFixed(1)}% • 
                  Cost/Appointment: ${campaign.costPerAppointment}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Analysis */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            Pipeline Analysis
          </h2>
          <div style={styles.card}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '20px',
            }}>
              {analytics.pipeline.map((stage, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                    {stage.count}
                  </div>
                  <div style={{ color: '#a0a9c0', fontSize: '14px', marginBottom: '8px' }}>
                    {stage.stage}
                  </div>
                  <div style={{ fontSize: '12px', color: '#22c55e', marginBottom: '4px' }}>
                    ${(stage.value / 1000).toFixed(0)}k value
                  </div>
                  <div style={{ fontSize: '10px', color: '#a0a9c0' }}>
                    {stage.averageDaysInStage.toFixed(1)} avg days
                  </div>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    marginTop: '8px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${stage.conversionRate}%`,
                      height: '100%',
                      background: stage.conversionRate > 70 ? '#22c55e' : stage.conversionRate > 50 ? '#f59e0b' : '#ef4444',
                      borderRadius: '2px',
                    }} />
                  </div>
                  <div style={{ fontSize: '10px', color: '#a0a9c0', marginTop: '4px' }}>
                    {stage.conversionRate}% conversion
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            Key Insights & Recommendations
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            <div style={{ ...styles.card, borderLeft: '4px solid #22c55e' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#22c55e' }}>
                🎯 Top Performing Source
              </h3>
              <p style={{ color: '#a0a9c0', marginBottom: '8px' }}>
                Facebook Ads is your highest ROI source at 3,597% return
              </p>
              <p style={{ fontSize: '14px', color: '#ffffff' }}>
                <strong>Action:</strong> Increase Facebook ad spend by 50% to scale winning campaigns
              </p>
            </div>

            <div style={{ ...styles.card, borderLeft: '4px solid #f59e0b' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#f59e0b' }}>
                ⚠️ Pipeline Bottleneck
              </h3>
              <p style={{ color: '#a0a9c0', marginBottom: '8px' }}>
                "Estimate Provided" stage has 60% conversion rate
              </p>
              <p style={{ fontSize: '14px', color: '#ffffff' }}>
                <strong>Action:</strong> Follow up faster and add urgency to estimate presentations
              </p>
            </div>

            <div style={{ ...styles.card, borderLeft: '4px solid #3b82f6' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#3b82f6' }}>
                📈 Growth Opportunity
              </h3>
              <p style={{ color: '#a0a9c0', marginBottom: '8px' }}>
                Your 18.1% conversion rate is above industry average (12-15%)
              </p>
              <p style={{ fontSize: '14px', color: '#ffffff' }}>
                <strong>Action:</strong> Scale successful campaigns to reach 40+ appointments/month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}