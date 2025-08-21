'use client'

import { useState, useRef } from 'react'
import { Navigation, AceternityBackgroundBeams, AceternityCarousel, AceternityCard, AceternityCardSpotlight, FeaturesSection, Footer, AceternityHeroHighlight } from '../../components/ui'

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


  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#0a0e27',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Full Viewport Background System */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(15, 23, 42, 0.9) 25%, rgba(30, 41, 59, 0.85) 50%, rgba(15, 23, 42, 0.9) 75%, rgba(10, 14, 39, 0.95) 100%)',
        zIndex: -3,
        pointerEvents: 'none'
      }} />
      
      {/* Removed global beams - now contained within hero section */}
      
      {/* Global grid texture */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.4
      }} />
      {/* Navigation */}
      <Navigation 
        items={[]}
        showCTA={true}
        ctaText="Get Ads for $295"
        showLogin={true}
      />

      {/* Hero Section - Clean implementation per UI spec */}
      <AceternityHeroHighlight
        title="$295 Ads That Book $8K+ Window Jobs"
        highlightText="Or We Pay You"
        description="Set up in under 15 minutes. First lead in under 48 hours. 20 booked appointments in 28 days guaranteed."
        ctaText="🚀 Launch My $8K+ Ads for $295"
        onCtaClick={scrollToOrder}
      />

      {/* Problem Section */}
      <section style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        paddingTop: '80px',
        paddingBottom: '80px',
        position: 'relative',
        background: 'rgba(30, 41, 59, 0.1)',
        backdropFilter: 'blur(1px)',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center'
      }}>
        
        {/* Enhanced Glowing Container */}
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '60px 40px',
          border: '2px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          boxShadow: `
            0 0 40px rgba(255, 107, 107, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated glow effect */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24, #ff6b6b)',
            borderRadius: '24px',
            zIndex: -1,
            animation: 'pulse 3s ease-in-out infinite'
          }} />
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              marginBottom: '30px',
              color: '#1a1a1a',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              letterSpacing: '-0.02em'
            }}>
              Dear Window & Door Professional,
            </h2>
            <p style={{ 
              fontSize: '22px', 
              color: '#374151', 
              maxWidth: '600px', 
              margin: '0 auto',
              fontWeight: 500,
              lineHeight: 1.5
            }}>
              Are you tired of paying <strong style={{ color: '#dc2626' }}>$5,000/month retainers</strong> to marketing agencies that promise the world but deliver crickets?
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: '25px',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {[
              {
                number: "01",
                title: "Agency Nightmare",
                description: "$5K/month retainers for 'impressions' and pretty reports that don't book a single job."
              },
              {
                number: "02", 
                title: "DIY Disaster",
                description: "Wasted months trying Facebook ads yourself, burning through budget with zero appointments."
              },
              {
                number: "03",
                title: "Referral Roulette",
                description: "Feast or famine business model depending on word-of-mouth and seasonal demand."
              },
              {
                number: "04",
                title: "Price Competition",
                description: "Racing to the bottom with low-value leads while competitors book $8K+ premium projects."
              }
            ].map((problem) => (
              <div key={problem.number} style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                border: '1px solid rgba(255, 107, 107, 0.2)',
                borderRadius: '16px',
                padding: '30px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '-12px',
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
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                }}>
                  {problem.number}
                </div>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  marginBottom: '15px', 
                  color: '#dc2626',
                  marginTop: '15px'
                }}>
                  {problem.title}
                </h3>
                <p style={{ 
                  color: '#4b5563', 
                  fontSize: '15px', 
                  lineHeight: 1.6,
                  fontWeight: 500
                }}>
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <p style={{ 
              fontSize: '26px', 
              color: '#1f2937', 
              marginBottom: '30px',
              fontWeight: 600,
              lineHeight: 1.4
            }}>
              What if there was a better way? A way that costs less than a single lead but books <span style={{ color: '#dc2626' }}>20+ appointments</span>?
            </p>
            <button onClick={scrollToOrder} style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              Show Me The Solution →
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        paddingTop: '80px',
        paddingBottom: '80px',
        position: 'relative',
        background: 'rgba(15, 23, 42, 0.15)', // Semi-transparent to show global background
        backdropFilter: 'blur(1px)',
        overflow: 'hidden'
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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
          textAlign: 'center',
        }}>
          {[
            { number: "847", label: "Contractors Using Our System" },
            { number: "$23.7M", label: "Revenue Generated" },
            { number: "12,429", label: "Appointments Booked" },
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
              quote: "We booked 22 appointments in our first month and closed $127K in new business. The follow-up scripts alone are worth 10x the price.",
              author: "Mike Richardson",
              company: "Premier Windows & Doors, Dallas TX",
              result: "$127K revenue, 22 appointments"
            },
            {
              quote: "Finally ditched our $4,500/month agency. This system books more qualified leads for less than we used to spend on coffee.",
              author: "Sarah Chen", 
              company: "ClearView Installation, Seattle WA",
              result: "Saved $4,205/month, 3x more leads"
            },
          ].map((testimonial, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '4px solid #ff6b6b',
              borderRadius: '12px',
              padding: '24px',
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
        </div>
      </section>

      {/* Lemonbrand UI Spec Compliant Features Section */}
      <FeaturesSection />

      {/* Proven Ad Templates Carousel */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        paddingTop: '80px',
        paddingBottom: '80px',
        position: 'relative',
        background: 'rgba(15, 23, 42, 0.15)', // Semi-transparent to show global background
        backdropFilter: 'blur(1px)',
        overflow: 'hidden'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '16px',
            color: '#ffffff'
          }}>
            Proven Ad Templates That Convert
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#a0a9c0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            See the exact ad templates that have generated thousands of leads for window and door contractors
          </p>
        </div>
        
        <AceternityCarousel items={[
          <AceternityCard
            key={1}
            card={{
              src: "/api/placeholder/400/400",
              title: "Premium Window Replacement",
              category: "WINDOWS",
              content: (
                <div>
                  <p style={{ marginBottom: '16px', color: '#a0a9c0' }}>
                    High-converting ad targeting homeowners with 15+ year old windows. Focuses on energy savings and home value.
                  </p>
                  <ul style={{ color: '#a0a9c0', paddingLeft: '20px' }}>
                    <li>Energy efficiency messaging</li>
                    <li>ROI-focused headlines</li>
                    <li>Seasonal timing optimization</li>
                    <li>Local market targeting</li>
                  </ul>
                </div>
              )
            }}
            index={0}
            layout={true}
          />,
          <AceternityCard
            key={2}
            card={{
              src: "/api/placeholder/400/400",
              title: "Luxury Patio Door Campaign",
              category: "DOORS",
              content: (
                <div>
                  <p style={{ marginBottom: '16px', color: '#a0a9c0' }}>
                    Upscale targeting for premium sliding and French doors. Emphasizes quality craftsmanship and curb appeal.
                  </p>
                  <ul style={{ color: '#a0a9c0', paddingLeft: '20px' }}>
                    <li>Premium positioning strategy</li>
                    <li>Quality-focused messaging</li>
                    <li>Luxury market targeting</li>
                    <li>High-value lead generation</li>
                  </ul>
                </div>
              )
            }}
            index={1}
            layout={true}
          />,
          <AceternityCard
            key={3}
            card={{
              src: "/api/placeholder/400/400",
              title: "Emergency Door Repair",
              category: "REPAIR",
              content: (
                <div>
                  <p style={{ marginBottom: '16px', color: '#a0a9c0' }}>
                    Urgent repair services ad with strong call-to-action. Perfect for capturing immediate need customers.
                  </p>
                  <ul style={{ color: '#a0a9c0', paddingLeft: '20px' }}>
                    <li>Urgency-driven copy</li>
                    <li>24/7 service messaging</li>
                    <li>Trust-building elements</li>
                    <li>Quick response guarantees</li>
                  </ul>
                </div>
              )
            }}
            index={2}
            layout={true}
          />,
          <AceternityCard
            key={4}
            card={{
              src: "/api/placeholder/400/400",
              title: "Energy Efficiency Upgrade",
              category: "REBATES",
              content: (
                <div>
                  <p style={{ marginBottom: '16px', color: '#a0a9c0' }}>
                    Government rebate and tax credit focused campaign. Appeals to cost-conscious homeowners.
                  </p>
                  <ul style={{ color: '#a0a9c0', paddingLeft: '20px' }}>
                    <li>Rebate maximization messaging</li>
                    <li>Tax credit positioning</li>
                    <li>Cost savings calculator</li>
                    <li>Government program updates</li>
                  </ul>
                </div>
              )
            }}
            index={3}
            layout={true}
          />,
          <AceternityCard
            key={5}
            card={{
              src: "/api/placeholder/400/400",
              title: "Storm Door Protection",
              category: "SEASONAL",
              content: (
                <div>
                  <p style={{ marginBottom: '16px', color: '#a0a9c0' }}>
                    Seasonal campaign for storm door installation. Weather-focused messaging with urgency.
                  </p>
                  <ul style={{ color: '#a0a9c0', paddingLeft: '20px' }}>
                    <li>Weather protection benefits</li>
                    <li>Seasonal urgency messaging</li>
                    <li>Storm preparation focus</li>
                    <li>Climate-specific targeting</li>
                  </ul>
                </div>
              )
            }}
            index={4}
            layout={true}
          />
        ]} />
      </section>

      {/* Order Form */}
      <section ref={orderFormRef} style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        maxWidth: '800px',
        paddingTop: '120px',
        paddingBottom: '80px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '20px',
          }}>
            Start Booking $8K+ Jobs Today
          </h2>
          <p style={{ fontSize: '20px', color: '#a0a9c0' }}>
            Join 847+ contractors already dominating their markets
          </p>
        </div>

        <AceternityCardSpotlight color="#ff6b6b" radius={400}>
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
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${businessName ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: 'white'
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
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${city ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: 'white'
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
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${email ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: 'white'
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
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
              width: '100%',
              opacity: (!businessName || !city || !email || isProcessing) ? 0.6 : 1,
              cursor: (!businessName || !city || !email || isProcessing) ? 'not-allowed' : 'pointer',
              fontSize: '24px',
              padding: '24px',
            }}
          >
            {isProcessing ? 'Processing...' : '🚀 Launch My $8K+ Ads for $295'}
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
        </AceternityCardSpotlight>
      </section>

      {/* FAQ Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        maxWidth: '800px',
        paddingTop: '80px',
        paddingBottom: '80px'
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
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        paddingTop: '80px',
        paddingBottom: '80px',
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
          <span style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>20+ Appointments</span> This Month.
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
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            border: 'none',
            borderRadius: '25px',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 600,
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
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

      {/* Footer */}
      <Footer />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes glow {
          from {
            box-shadow: 0 0 30px rgba(255, 107, 107, 0.5), 0 8px 25px rgba(0, 0, 0, 0.3);
          }
          to {
            box-shadow: 0 0 40px rgba(255, 107, 107, 0.8), 0 8px 35px rgba(0, 0, 0, 0.4);
          }
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