'use client'

import { useState, useRef } from 'react'

export default function GetStartedPage() {
  const [businessName, setBusinessName] = useState('')
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showVSL, setShowVSL] = useState(false)
  const orderFormRef = useRef<HTMLDivElement>(null)

  const handlePurchase = async () => {
    // Client-side validation
    const errors = []
    if (!businessName?.trim()) errors.push('Business name is required')
    if (!city?.trim()) errors.push('City is required')
    if (!email?.trim()) errors.push('Email is required')
    
    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return
    }

    setIsProcessing(true)
    console.log('🚀 Starting checkout process for:', { businessName, city, email })
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: businessName.trim(),
          city: city.trim(),
          email: email.trim(),
        }),
      })

      const data = await response.json()
      console.log('📊 Checkout API response:', data)

      if (!response.ok) {
        // Handle validation errors differently
        if (response.status === 400 && data.details) {
          alert('Please correct the following:\n' + data.details.join('\n'))
        } else {
          alert(data.error || 'Failed to create checkout session')
        }
        setIsProcessing(false)
        return
      }

      if (data.checkoutUrl) {
        console.log('✅ Redirecting to Stripe checkout:', data.sessionId)
        // Add a slight delay to show the processing state
        setTimeout(() => {
          window.location.href = data.checkoutUrl
        }, 500)
      } else {
        throw new Error('No checkout URL received from server')
      }

    } catch (error) {
      console.error('❌ Purchase error:', error)
      
      // Show user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          alert('Network error. Please check your internet connection and try again.')
        } else {
          alert('Sorry, there was an error processing your request. Please try again in a moment.')
        }
      } else {
        alert('An unexpected error occurred. Please try again.')
      }
      
      setIsProcessing(false)
    }
  }

  const scrollToOrder = () => {
    orderFormRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const styles = {
    // Modern Design System - Stripe Inspired
    container: {
      backgroundColor: '#0a0e27',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.6,
    },
    section: {
      padding: '80px 0',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    sectionNarrow: {
      padding: '80px 0',
      maxWidth: '800px',
      margin: '0 auto',
      paddingLeft: '24px',
      paddingRight: '24px',
    },
    gradient: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    button: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '18px 36px',
      fontSize: '18px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
      textTransform: 'none',
    },
    buttonLarge: {
      padding: '24px 48px',
      fontSize: '20px',
      borderRadius: '16px',
    },
    card: {
      background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
      borderRadius: '24px',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      fontSize: '16px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box' as const,
    },
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
        padding: '20px 0',
        zIndex: 1000,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Windows Ad Kit
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/create-campaign" style={{
              color: '#a0a9c0',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}>
              Campaign Creator
            </a>
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 700,
              animation: 'pulse 2s infinite',
            }}>
              🔥 Limited Time: $295 (Reg. $997)
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Problem Agitation */}
      <section style={{ ...styles.section, textAlign: 'center', paddingTop: '120px' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          padding: '12px 24px',
          borderRadius: '30px',
          marginBottom: '30px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#ff6b6b',
        }}>
          ⚠️ ATTENTION WINDOW & DOOR CONTRACTORS
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '30px',
          letterSpacing: '-0.02em',
        }}>
          Tired of Your Phone
          <br />
          <span style={styles.gradient}>Not Ringing?</span>
        </h1>

        <div style={{
          fontSize: '24px',
          color: '#a0a9c0',
          marginBottom: '50px',
          maxWidth: '800px',
          margin: '0 auto 50px',
        }}>
          While your competitors book <strong style={{ color: '#ff6b6b' }}>20+ appointments every month</strong>, 
          you're stuck waiting for referrals and praying the phone rings...
        </div>

        <button
          onClick={scrollToOrder}
          style={{ ...styles.button, ...styles.buttonLarge }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 107, 107, 0.3)'
          }}
        >
          Get My Windows Ad Kit Now → Only $295
        </button>

        {/* Optional VSL Toggle */}
        <div style={{ marginTop: '40px' }}>
          <button
            onClick={() => setShowVSL(!showVSL)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#a0a9c0',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {showVSL ? '📖 Read the story instead' : '🎬 Watch the story (3 min video)'}
          </button>
        </div>

        {showVSL && (
          <div style={{
            marginTop: '40px',
            maxWidth: '800px',
            margin: '40px auto 0',
            ...styles.card,
          }}>
            <div style={{
              aspectRatio: '16/9',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#a0a9c0',
            }}>
              🎬 VSL Placeholder (3:47)
              <br />
              <span style={{ fontSize: '14px' }}>Video will embed here</span>
            </div>
          </div>
        )}
      </section>

      {/* Problem Section */}
      <section style={{ ...styles.section, background: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            marginBottom: '30px',
            color: '#ff6b6b',
          }}>
            The 4 Reasons Window Contractors Stay Broke
          </h2>
          <p style={{ fontSize: '20px', color: '#a0a9c0', maxWidth: '700px', margin: '0 auto' }}>
            After working with 500+ contractors, we've identified exactly why most struggle to grow...
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
        }}>
          {[
            {
              number: "01",
              title: "Invisible Online",
              description: "Your competitors dominate Google while you're stuck hoping for referrals. No online presence = no consistent leads."
            },
            {
              number: "02", 
              title: "Feast or Famine",
              description: "Busy spring/summer, dead winter. Seasonal revenue swings destroy cash flow and stress your family finances."
            },
            {
              number: "03",
              title: "Price Shoppers Only",
              description: "The few leads you get are bottom-feeders looking for the cheapest quote. No premium projects, no profit margins."
            },
            {
              number: "04",
              title: "Agency Money Pit",
              description: "$3,000/month for 'brand awareness' and 'impressions' but zero actual appointments. Just excuses and pretty reports."
            }
          ].map((problem) => (
            <div key={problem.number} style={{
              ...styles.card,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 900,
                color: 'white',
              }}>
                {problem.number}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: '#ff6b6b' }}>
                {problem.title}
              </h3>
              <p style={{ color: '#a0a9c0', fontSize: '16px', lineHeight: 1.6 }}>
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <p style={{ fontSize: '24px', color: '#a0a9c0', marginBottom: '30px' }}>
            Sound familiar? Here's the solution that's already working for 200+ contractors...
          </p>
          <button onClick={scrollToOrder} style={styles.button}>
            Show Me The Solution →
          </button>
        </div>
      </section>

      {/* Social Proof */}
      <section style={styles.section}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '20px',
          }}>
            Real Contractors. Real Results.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
          textAlign: 'center',
        }}>
          {[
            { number: "200+", label: "Contractors Using Our System" },
            { number: "$2.3M+", label: "Revenue Generated" },
            { number: "4,200+", label: "Appointments Booked" },
            { number: "$47", label: "Avg. Cost Per Appointment" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px',
              }}>
                {stat.number}
              </div>
              <div style={{ color: '#a0a9c0', fontSize: '16px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
        }}>
          {[
            {
              quote: "23 appointments in my first month. Had to hire 2 new installers just to keep up with demand!",
              author: "Mike Richardson",
              company: "Premier Windows & Doors, Dallas TX",
              result: "23 appointments, $34k revenue"
            },
            {
              quote: "Finally ditched my $3k/month agency. This system books more appointments for 1/10th the cost.",
              author: "Sarah Chen", 
              company: "ClearView Installation, Seattle WA",
              result: "Saved $2.7k/month, doubled bookings"
            },
          ].map((testimonial, index) => (
            <div key={index} style={{
              ...styles.card,
              borderLeft: '4px solid #ff6b6b',
            }}>
              <div style={{
                fontSize: '18px',
                fontStyle: 'italic',
                marginBottom: '20px',
                color: '#ffffff',
                lineHeight: 1.6,
              }}>
                "{testimonial.quote}"
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#ff6b6b', marginBottom: '4px' }}>
                    {testimonial.author}
                  </div>
                  <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
                    {testimonial.company}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#ff6b6b',
                  whiteSpace: 'nowrap',
                }}>
                  {testimonial.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What's Included - Value Stack */}
      <section style={{ ...styles.section, background: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            marginBottom: '30px',
          }}>
            Everything You Get With The
            <br />
            <span style={styles.gradient}>Windows Ad Kit</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
        }}>
          {[
            {
              icon: "🎯",
              title: "3 Proven Campaign Templates",
              description: "Emergency Repair, Energy Savings, and Tax Credit campaigns. Copy-paste ready with $47 average cost per appointment.",
              value: "$497"
            },
            {
              icon: "📱",
              title: "High-Converting Landing Pages", 
              description: "Mobile-optimized pages that convert 31% of visitors into booked appointments. No web developer needed.",
              value: "$797"
            },
            {
              icon: "📲",
              title: "SMS Follow-Up Automation",
              description: "7-message sequences that book appointments while you sleep. 89% open rates, 34% response rates.",
              value: "$397"
            },
            {
              icon: "🚀",
              title: "72-Hour Installation Support",
              description: "Our team personally helps you launch everything within 3 days or it's completely free.",
              value: "$997"
            },
            {
              icon: "📅",
              title: "Seasonal Campaign Calendar",
              description: "12-month blueprint to eliminate slow seasons forever. Never worry about winter again.",
              value: "$297"
            },
            {
              icon: "🎓",
              title: "Contractor Masterclass",
              description: "2-hour deep-dive training on appointment optimization and closing more deals.",
              value: "$497"
            },
          ].map((item, index) => (
            <div key={index} style={{
              ...styles.card,
              textAlign: 'center',
              position: 'relative',
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px',
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '16px',
                color: '#ffffff',
              }}>
                {item.title}
              </h3>
              <p style={{
                color: '#a0a9c0',
                fontSize: '16px',
                lineHeight: 1.6,
                marginBottom: '20px',
              }}>
                {item.description}
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-block',
              }}>
                Value: {item.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '80px',
          ...styles.card,
        }}>
          <div style={{ fontSize: '20px', color: '#a0a9c0', marginBottom: '16px' }}>
            Total Value: <span style={{ textDecoration: 'line-through' }}>$3,482</span>
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
          }}>
            Your Investment Today: Only $295
          </div>
          <div style={{
            fontSize: '18px',
            color: '#a0a9c0',
            marginBottom: '30px',
          }}>
            Save $3,187 • One-time payment • Lifetime access
          </div>
          <button onClick={scrollToOrder} style={{ ...styles.button, ...styles.buttonLarge }}>
            Secure My Windows Ad Kit Now →
          </button>
        </div>
      </section>

      {/* Order Form */}
      <section ref={orderFormRef} style={{ ...styles.sectionNarrow, paddingTop: '120px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '20px',
          }}>
            Claim Your Windows Ad Kit
          </h2>
          <p style={{ fontSize: '20px', color: '#a0a9c0' }}>
            Join 200+ contractors already dominating their markets
          </p>
        </div>

        <div style={styles.card}>
          <div style={{
            display: 'grid',
            gap: '24px',
            marginBottom: '40px',
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
              }}>
                Business Name *
              </label>
              <input
                type="text"
                name="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Mike's Premium Windows"
                style={{
                  ...styles.input,
                  borderColor: businessName ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
                onBlur={(e) => e.target.style.borderColor = businessName ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
              }}>
                City *
              </label>
              <input
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Austin"
                style={{
                  ...styles.input,
                  borderColor: city ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
                onBlur={(e) => e.target.style.borderColor = city ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
              }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  ...styles.input,
                  borderColor: email ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b6b'}
                onBlur={(e) => e.target.style.borderColor = email ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={!businessName || !city || !email || isProcessing}
            style={{
              ...styles.button,
              ...styles.buttonLarge,
              width: '100%',
              opacity: (!businessName || !city || !email || isProcessing) ? 0.6 : 1,
              cursor: (!businessName || !city || !email || isProcessing) ? 'not-allowed' : 'pointer',
              fontSize: '24px',
              padding: '24px',
            }}
          >
            {isProcessing ? 'Processing...' : '🔐 Get My Ad Kit for $295 →'}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '14px',
            color: '#a0a9c0',
          }}>
            🔒 Secure checkout • 💳 All major cards accepted • ✅ Instant access
          </div>

          {/* Guarantee */}
          <div style={{
            marginTop: '40px',
            padding: '24px',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '16px',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#ff6b6b' }}>
              🛡️ Iron-Clad Guarantee
            </h3>
            <p style={{ color: '#a0a9c0', lineHeight: 1.6 }}>
              <strong>20 booked appointments in 28 days or we work for free</strong> until you get them. 
              Plus 30-day money-back guarantee if you're not completely satisfied.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.sectionNarrow}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '20px',
          }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            {
              question: "Will this work in my city/market?",
              answer: "Yes! We've successfully deployed in 200+ markets from major metros to towns with 50,000 people. The campaigns target universal pain points (energy costs, security, comfort) that resonate everywhere."
            },
            {
              question: "I'm not tech-savvy. Can I really set this up?",
              answer: "Absolutely. Everything is copy-and-paste simple. Plus our 72-hour guarantee means we literally hold your hand through setup via Zoom and don't stop until your campaigns are live."
            },
            {
              question: "How much should I budget for actual ad spend?",
              answer: "Most contractors start with $30-50/day ($900-1500/month) and scale up. At our $47 average cost per appointment, that's 19-32 appointments per month."
            },
            {
              question: "What if I don't get 20 appointments in 28 days?",
              answer: "Then we work for free until you do. We'll optimize campaigns, adjust targeting, rewrite ads - whatever it takes. We've never had a contractor who followed the system not hit this goal."
            },
          ].map((faq, index) => (
            <details key={index} style={{
              ...styles.card,
              cursor: 'pointer',
            }}>
              <summary style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#ffffff',
                padding: '20px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                listStyle: 'none',
              }}>
                {faq.question}
              </summary>
              <div style={{
                padding: '20px 0',
                color: '#a0a9c0',
                lineHeight: 1.6,
              }}>
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ ...styles.section, textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          marginBottom: '30px',
        }}>
          Your Competitors Are Booking
          <br />
          <span style={styles.gradient}>20+ Appointments</span> This Month.
          <br />
          <span style={{ color: '#ff6b6b' }}>Are You?</span>
        </h2>

        <div style={{
          background: 'rgba(255, 107, 107, 0.1)',
          border: '2px solid #ff6b6b',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '50px',
          maxWidth: '600px',
          margin: '0 auto 50px',
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#ff6b6b' }}>
            ⚠️ SPECIAL PRICING ENDS SOON
          </h3>
          <p style={{ fontSize: '18px', color: '#a0a9c0' }}>
            Price increases to $997 after this promotion. 
            Secure your $295 investment now.
          </p>
        </div>

        <button
          onClick={scrollToOrder}
          style={{ ...styles.button, ...styles.buttonLarge, fontSize: '28px', padding: '30px 60px' }}
        >
          Secure Your Windows Ad Kit for $295 →
        </button>

        <p style={{
          fontSize: '18px',
          color: '#a0a9c0',
          marginTop: '30px',
          maxWidth: '600px',
          margin: '30px auto 0',
        }}>
          <strong>Remember:</strong> 20 booked appointments in 28 days guaranteed
          or we work for free until you get them. You have nothing to lose.
        </p>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        details > summary::-webkit-details-marker {
          display: none;
        }
        
        details > summary::before {
          content: '+';
          font-size: 24px;
          font-weight: 700;
          color: #ff6b6b;
          float: right;
          transition: transform 0.3s ease;
        }
        
        details[open] > summary::before {
          transform: rotate(45deg);
        }
      `}</style>
    </div>
  )
}