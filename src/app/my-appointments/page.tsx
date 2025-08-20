'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data for development - in production this would come from the database
const mockCustomer = {
  business_name: "Bob's Windows & Doors",
  city: "Dallas",
  email: "bob@bobswindows.com",
  status: "active"
}

// New customer data (just purchased)
const mockStats = {
  appointments_booked: 0,
  cost_per_appointment: 0,
  campaign_status: "preparing",
  hours_until_live: 48
}

const mockAppointments = [
  // Sample data to show what it will look like
  {
    id: "sample-1",
    homeowner_name: "Sarah Johnson",
    date: "2025-01-25T14:00:00Z",
    appointment_type: "Estimate",
    status: "Scheduled",
    estimated_value: 2500,
    is_sample: true
  },
  {
    id: "sample-2", 
    homeowner_name: "Mike Chen",
    date: "2025-01-26T10:30:00Z",
    appointment_type: "Measurement",
    status: "Scheduled",
    estimated_value: 1800,
    is_sample: true
  }
]

export default function MyAppointmentsPage() {
  const [showSampleData, setShowSampleData] = useState(true)

  return (
    <div style={{ 
      backgroundColor: '#1a2332', 
      color: '#ffffff', 
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #1a2332 100%)',
        padding: '20px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff6b35' }}>
            WINDOWS AD KIT™
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#94a3b8' }}>Welcome back, {mockCustomer.business_name}!</span>
            <div style={{ 
              background: '#ff6b35', 
              padding: '8px 16px', 
              borderRadius: '4px', 
              fontWeight: 700,
              color: 'white',
              fontSize: '0.9rem'
            }}>
              PREPARING
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 900, 
            marginBottom: '20px' 
          }}>
            Welcome back, <span style={{ color: '#ff6b35' }}>{mockCustomer.business_name}</span>!
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#94a3b8', 
            marginBottom: '30px' 
          }}>
            Your campaigns are being prepared and will go live in <span style={{ color: '#ff6b35', fontWeight: 700 }}>{mockStats.hours_until_live} hours</span>
          </p>
        </div>

        {/* Stats Dashboard */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '30px', 
            textAlign: 'center' 
          }}>
            Your Numbers This Month
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{ 
              background: '#1e293b', 
              padding: '30px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📅</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ff6b35', marginBottom: '10px' }}>
                {mockStats.appointments_booked}
              </div>
              <div style={{ color: '#94a3b8' }}>Appointments Booked</div>
              <div style={{ color: '#22c55e', fontSize: '0.9rem', marginTop: '5px', fontWeight: 600 }}>
                (starting soon!)
              </div>
            </div>

            <div style={{ 
              background: '#1e293b', 
              padding: '30px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#94a3b8', marginBottom: '10px' }}>
                $--
              </div>
              <div style={{ color: '#94a3b8' }}>Cost Per Appointment</div>
              <div style={{ color: '#22c55e', fontSize: '0.9rem', marginTop: '5px', fontWeight: 600 }}>
                (calculating...)
              </div>
            </div>

            <div style={{ 
              background: '#1e293b', 
              padding: '30px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff6b35', marginBottom: '10px' }}>
                PREPARING
              </div>
              <div style={{ color: '#94a3b8' }}>Campaign Status</div>
              <div style={{ color: '#22c55e', fontSize: '0.9rem', marginTop: '5px', fontWeight: 600 }}>
                (goes live in {mockStats.hours_until_live} hours)
              </div>
            </div>
          </div>

          {/* View Campaign Setup Button */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <Link
              href="/my-campaigns"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #ff6b35, #ff8451)',
                color: 'white',
                padding: '20px 40px',
                fontSize: '1.25rem',
                fontWeight: 800,
                border: 'none',
                borderRadius: '8px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
              }}
            >
              View My Campaign Setup →
            </Link>
          </div>
        </div>

        {/* Appointments Section */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
              Upcoming Appointments
            </h2>
            {showSampleData && (
              <div style={{ 
                background: 'rgba(255, 107, 53, 0.1)', 
                border: '1px solid #ff6b35',
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '0.8rem',
                color: '#ff6b35'
              }}>
                PREVIEW - Sample appointments
              </div>
            )}
          </div>
          
          {mockStats.appointments_booked === 0 ? (
            <div style={{ 
              background: '#1e293b', 
              padding: '40px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              {showSampleData ? (
                <>
                  <p style={{ color: '#94a3b8', marginBottom: '30px' }}>
                    Here's what your appointments will look like once your campaigns go live:
                  </p>
                  <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                    {mockAppointments.map((appointment) => (
                      <div key={appointment.id} style={{ 
                        background: '#374151', 
                        padding: '25px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        opacity: 0.7,
                        position: 'relative'
                      }}>
                        <div style={{ 
                          position: 'absolute',
                          top: '10px',
                          right: '15px',
                          background: '#ff6b35',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>
                          SAMPLE
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '1.2rem' }}>
                              {appointment.homeowner_name}
                            </h3>
                            <div style={{ color: '#94a3b8', marginBottom: '10px' }}>
                              📅 {new Date(appointment.date).toLocaleDateString()} at {new Date(appointment.date).toLocaleTimeString()}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                              <span style={{ 
                                background: '#ff6b35', 
                                color: 'white', 
                                padding: '4px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem', 
                                fontWeight: 700,
                                marginRight: '10px'
                              }}>
                                {appointment.appointment_type}
                              </span>
                              <span style={{ 
                                background: '#22c55e',
                                color: '#1a2332',
                                padding: '4px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem', 
                                fontWeight: 700
                              }}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                              Estimated Value
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
                              ${appointment.estimated_value.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowSampleData(false)}
                    style={{
                      background: 'none',
                      border: '1px solid #94a3b8',
                      color: '#94a3b8',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Hide Sample Data
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>📅</div>
                  <h3 style={{ marginBottom: '15px' }}>No appointments yet</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
                    Your campaigns will go live in {mockStats.hours_until_live} hours.<br/>
                    First appointments typically come within 3-5 days.
                  </p>
                  <button
                    onClick={() => setShowSampleData(true)}
                    style={{
                      background: '#ff6b35',
                      border: 'none',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    Show Preview
                  </button>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Real appointments would render here */}
            </div>
          )}
        </div>

        {/* Next Steps Section */}
        <div style={{ 
          background: '#1e293b', 
          padding: '40px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#ff6b35' }}>
            Clear Next Steps
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                background: '#22c55e', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: '18px'
              }}>✅</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '5px' }}>Kit purchased</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Payment confirmed, welcome email sent</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                background: '#ff6b35', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: '18px'
              }}>⏳</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '5px' }}>Campaigns preparing</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>({mockStats.hours_until_live} hours remaining)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                background: '#94a3b8', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: '18px'
              }}>⏳</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '5px' }}>First appointments expected</div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>in 3-5 days after campaigns go live</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}