'use client'

import { useState, useRef } from 'react'
import { useStyles, globalKeyframes } from '../../styles'
import { Navigation } from '../../components/ui'

export default function GetStartedPage() {
  const { theme, components, utils } = useStyles()
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


  return (
    <div style={components.layout.page.default}>
      {/* Navigation */}
      <Navigation 
        items={[]}
        showCTA={true}
        ctaText="Limited Year End only $295"
        showLogin={true}
      />

      {/* Hero Section - Problem Agitation */}
      <section style={{
        ...components.layout.container.base,
        textAlign: 'center',
        paddingTop: '60px',
        paddingBottom: theme.spacing['8xl']
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 107, 107, 0.1)',
          border: `1px solid ${theme.colors.primary}`,
          padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
          borderRadius: theme.borderRadius['3xl'],
          marginBottom: theme.spacing['3xl'],
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.primary,
        }}>
          ⚠️ ATTENTION WINDOW & DOOR CONTRACTORS
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: theme.typography.fontWeight.black,
          lineHeight: theme.typography.lineHeight.tight,
          marginBottom: theme.spacing['3xl'],
          letterSpacing: '-0.02em',
          color: theme.colors.text.primary
        }}>
          Tired of Your Phone
          <br />
          <span style={components.text.gradient.primary}>Not Ringing?</span>
        </h1>

        <div style={{
          fontSize: theme.typography.fontSize['2xl'],
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing['5xl'],
          maxWidth: '800px',
          margin: `0 auto ${theme.spacing['5xl']}`,
        }}>
          While your competitors book <strong style={{ color: theme.colors.primary }}>20+ appointments every month</strong>, 
          you're stuck waiting for referrals and praying the phone rings...
        </div>

        <button
          onClick={scrollToOrder}
          style={{
            ...components.button.base,
            ...components.button.primary,
            ...components.button.large
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = theme.shadows.lg
          }}
        >
          Get My Windows Ad Kit Now → Only $295
        </button>

        {/* Optional VSL Toggle */}
        <div style={{ marginTop: theme.spacing['4xl'] }}>
          <button
            onClick={() => setShowVSL(!showVSL)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.colors.border.light}`,
              color: theme.colors.text.secondary,
              padding: `${theme.spacing.md} ${theme.spacing['2xl']}`,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              fontFamily: theme.typography.fontFamily.base
            }}
          >
            {showVSL ? '📖 Read the story instead' : '🎬 Watch the story (3 min video)'}
          </button>
        </div>

        {showVSL && (
          <div style={{
            marginTop: theme.spacing['4xl'],
            maxWidth: '800px',
            margin: `${theme.spacing['4xl']} auto 0`,
            ...components.card.base,
          }}>
            <div style={{
              aspectRatio: '16/9',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: theme.borderRadius.lg,
              ...utils.flex.center,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              flexDirection: 'column'
            }}>
              🎬 VSL Placeholder (3:47)
              <br />
              <span style={{ fontSize: theme.typography.fontSize.sm }}>Video will embed here</span>
            </div>
          </div>
        )}
      </section>

      {/* Problem Section */}
      <section style={{
        ...components.layout.container.base,
        paddingTop: theme.spacing['8xl'],
        paddingBottom: theme.spacing['8xl'],
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
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
              ...components.card.base,
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
          <button onClick={scrollToOrder} style={{
            ...components.button.base,
            ...components.button.primary
          }}>
            Show Me The Solution →
          </button>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{
        ...components.layout.container.base,
        paddingTop: theme.spacing['8xl'],
        paddingBottom: theme.spacing['8xl']
      }}>
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
              ...components.card.base,
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
      <section style={{ 
        ...components.layout.container.base,
        paddingTop: theme.spacing['8xl'],
        paddingBottom: theme.spacing['8xl'],
        background: 'rgba(255, 255, 255, 0.02)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            marginBottom: '30px',
          }}>
            Everything You Get With The
            <br />
            <span style={components.text.gradient.primary}>Windows Ad Kit</span>
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
              ...components.card.base,
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
          ...components.card.base,
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
          <button onClick={scrollToOrder} style={{
            ...components.button.base,
            ...components.button.primary,
            ...components.button.large
          }}>
            Secure My Windows Ad Kit Now →
          </button>
        </div>
      </section>

      {/* Order Form */}
      <section ref={orderFormRef} style={{
        ...components.layout.container.base,
        maxWidth: '800px',
        paddingTop: '120px',
        paddingBottom: theme.spacing['8xl']
      }}>
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

        <div style={components.card.base}>
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
                  width: '100%',
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${businessName ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  fontSize: theme.typography.fontSize.base,
                  fontFamily: theme.typography.fontFamily.base,
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary
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
                  width: '100%',
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${city ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  fontSize: theme.typography.fontSize.base,
                  fontFamily: theme.typography.fontFamily.base,
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary
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
                  width: '100%',
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${email ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  fontSize: theme.typography.fontSize.base,
                  fontFamily: theme.typography.fontFamily.base,
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary
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
              ...components.button.base,
              ...components.button.primary,
              ...components.button.large,
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
      <section style={{
        ...components.layout.container.base,
        maxWidth: '800px',
        paddingTop: theme.spacing['8xl'],
        paddingBottom: theme.spacing['8xl']
      }}>
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
              ...components.card.base,
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
      <section style={{ 
        ...components.layout.container.base,
        paddingTop: theme.spacing['8xl'],
        paddingBottom: theme.spacing['8xl'],
        textAlign: 'center', 
        background: 'rgba(255, 255, 255, 0.02)' 
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          marginBottom: '30px',
        }}>
          Your Competitors Are Booking
          <br />
          <span style={components.text.gradient.primary}>20+ Appointments</span> This Month.
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
          style={{
            ...components.button.base,
            ...components.button.primary,
            ...components.button.large,
            fontSize: '28px', 
            padding: '30px 60px'
          }}
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
        
        ${globalKeyframes}
      `}</style>
    </div>
  )
}