'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function MetaTemplatePage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const fallbackBusinessName = searchParams.get('business') || 'Your Business'
  const fallbackCity = searchParams.get('city') || 'Your City'
  
  // Template selection removed - now using single adaptive campaign
  const [copiedSection, setCopiedSection] = useState('')
  const [selectedBudget, setSelectedBudget] = useState(75) // Daily budget in USD
  const [businessIntel, setBusinessIntel] = useState({
    avgProjectValue: 10000,
    businessType: 'windows_only',
    yearsInBusiness: '5_10',
    biggestChallenge: 'lead_generation',
    previousAdSpend: 'under_1000'
  })
  const [customer, setCustomer] = useState<any>(null)
  const [figmaJob, setFigmaJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(!!sessionId)
  
  // Use customer data if available, otherwise fall back to URL params
  const businessName = customer?.businessName || fallbackBusinessName
  const city = customer?.city || fallbackCity

  // Fetch real business intelligence data if session_id is provided
  useEffect(() => {
    if (sessionId) {
      fetchBusinessData(sessionId)
    }
  }, [sessionId])

  const fetchBusinessData = async (sessionId: string) => {
    try {
      // Fetch customer data
      const customerResponse = await fetch(`/api/customer?session_id=${sessionId}`)
      const customerData = await customerResponse.json()

      if (customerResponse.ok) {
        setCustomer(customerData.customer)
        
        // Fetch campaign data with business intelligence
        const generateResponse = await fetch(`/api/generate-ads?session_id=${sessionId}`)
        const generateData = await generateResponse.json()
        
        if (generateResponse.ok && generateData.figmaJob?.figma_package?.completeOnboardingData) {
          const onboardingData = generateData.figmaJob.figma_package.completeOnboardingData
          setFigmaJob(generateData.figmaJob)
          
          // Update business intelligence with real data
          setBusinessIntel({
            avgProjectValue: parseInt(onboardingData.marketInfo?.avgProjectValue) || 10000,
            businessType: onboardingData.businessIntelligence?.businessType || 'windows_only',
            yearsInBusiness: onboardingData.businessIntelligence?.yearsInBusiness || '5_10',
            biggestChallenge: onboardingData.businessIntelligence?.biggestChallenge || 'lead_generation',
            previousAdSpend: onboardingData.businessIntelligence?.previousAdSpend || 'under_1000'
          })
        }
      }
    } catch (error) {
      console.error('Error fetching business data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ROAS-Based ROI Calculation System
  const calculateROI = (dailyBudget: number, avgProjectValue: number, businessType: string, yearsInBusiness: string) => {
    // Calculate monthly budget from daily budget
    const monthlyBudget = dailyBudget * 30
    
    // Base lead costs by market competition (adjusted for budget efficiency) - More realistic industry standards
    const baseCostPerLead = businessType === 'windows_only' ? 120 : 150
    const experienceMultiplier = yearsInBusiness === '10_plus' ? 0.85 : yearsInBusiness === '0_2' ? 1.4 : 1.0
    const budgetEfficiencyMultiplier = dailyBudget > 100 ? 0.9 : dailyBudget < 50 ? 1.3 : 1.0
    const costPerLead = baseCostPerLead * experienceMultiplier * budgetEfficiencyMultiplier
    
    // Calculate leads per month
    const leadsPerMonth = monthlyBudget / costPerLead
    
    // Close rate based on business maturity
    const baseCloseRate = businessType === 'windows_only' ? 0.22 : 0.18
    const experienceCloseBonus = yearsInBusiness === '10_plus' ? 0.05 : yearsInBusiness === '0_2' ? -0.03 : 0
    const closeRate = baseCloseRate + experienceCloseBonus
    
    const projectsPerMonth = leadsPerMonth * closeRate
    const grossSales = projectsPerMonth * avgProjectValue
    
    // COGS estimation (Cost of Goods Sold) - typically 45-55% for window contractors
    const cogsPercentage = 0.50 // 50% COGS
    const cogs = grossSales * cogsPercentage
    
    // Revenue after COGS but before ad spend
    const revenueAfterCOGS = grossSales - cogs
    
    // Net profit after ad spend
    const netProfit = revenueAfterCOGS - monthlyBudget
    
    // ROAS (Return on Ad Spend)
    const roas = grossSales / monthlyBudget
    
    // ROI (Return on Investment) 
    const roi = (netProfit / monthlyBudget) * 100
    
    return {
      leadsPerMonth: Math.round(leadsPerMonth),
      costPerLead: Math.round(costPerLead),
      projectsPerMonth: Math.round(projectsPerMonth * 10) / 10,
      closeRate: Math.round(closeRate * 100),
      grossSales: Math.round(grossSales),
      cogs: Math.round(cogs),
      revenueAfterCOGS: Math.round(revenueAfterCOGS),
      netProfit: Math.round(netProfit),
      roas: Math.round(roas * 10) / 10,
      roi: Math.round(roi),
      dailyBudget: dailyBudget,
      monthlyBudget: monthlyBudget
    }
  }

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(''), 2000)
  }

  // Single Adaptive Campaign Template
  const getAdaptiveCampaign = () => {
    const roi = calculateROI(selectedBudget, businessIntel.avgProjectValue, businessIntel.businessType, businessIntel.yearsInBusiness)
    
    return {
      name: 'Custom AI-Optimized Campaign',
      description: `Meta AI-powered campaign optimized for ${businessIntel.businessType === 'windows_only' ? 'window replacement specialists' : 'exterior contractors'} with ${businessIntel.yearsInBusiness.replace('_', '-')} years experience`,
      dailyBudget: selectedBudget,
      expectedROI: roi,
      campaign: {
        name: `${businessName} - AI Lead Generation`,
        objective: 'Lead Generation',
        campaignType: 'Advantage+ Leads Campaign',
        budget: `$${selectedBudget}/day`,
        dailyBudget: selectedBudget,
        expectedResults: `${roi.leadsPerMonth} leads/month at ${roi.roas}:1 ROAS`,
        adSet: {
          name: 'AI-Optimized Homeowner Targeting',
          targeting: `${city} + 25mi radius, Ages 35-65, Homeowners, $75k+ income`,
          advantageFeatures: [
            'Advantage+ Creative: Auto-tests all 12 strategic ad variations',
            'Advantage Detailed Targeting: AI expands beyond initial audience',
            'Advantage Placements: Optimizes Facebook/Instagram placement mix',
            'Campaign Budget Optimization: AI allocates budget to best performers'
          ],
          ads: '12 AI-selected creative variations based on your business intelligence',
          optimizationSettings: {
            'Objective': 'Lead Generation',
            'Optimization Event': 'Leads',
            'Bid Strategy': 'Lowest cost per lead',
            'Budget': `$${selectedBudget}/day`,
            'Audience Expansion': 'Advantage Detailed Targeting ON',
            'Placements': 'Advantage Placements ON',
            'Creative Testing': 'Advantage+ Creative ON'
          }
        }
      }
    }
  }

  const targetingGuide = {
    demographics: {
      age: '35-65 (prime window replacement age)',
      income: '$75,000+ household income',
      homeownership: 'Homeowners only',
      location: `${city} + 25 mile radius`
    },
    interests: [
      'Home improvement',
      'Home renovation', 
      'Energy efficiency',
      'Home and garden',
      'Real estate',
      'Home decor'
    ],
    behaviors: [
      'Frequent international travelers (higher income indicator)',
      'Home improvement shoppers',
      'Recently moved (90 days)',
      'Anniversary of home purchase (5-15 years)'
    ],
    exclusions: [
      'Renters',
      'Age under 30',
      'Income under $50k',
      'Recently engaged with competitors'
    ],
    advanced: {
      'Peak Performance Targeting': [
        'Homeowners aged 45-65 with $100k+ income',
        'Recently searched "window replacement" or "energy efficient windows"',
        'Live in homes built 1980-2010 (prime replacement age)',
        'Show interest in home improvement or energy savings'
      ],
      'Seasonal Adjustments': [
        'Spring: Focus on energy efficiency and curb appeal',
        'Summer: Emphasize comfort and cooling savings', 
        'Fall: Target storm protection and winter prep',
        'Winter: Focus on drafty windows and heating costs'
      ],
      'Budget-Based Segmentation': [
        'Premium ($15k+): Luxury materials, lifetime warranties',
        'Mid-tier ($8-15k): Quality with financing options',
        'Budget ($5-8k): Value proposition, basic efficiency'
      ]
    }
  }

  const getBudgetRecommendations = () => {
    const calculateExpectations = (dailyBudget: number) => {
      const roi = calculateROI(dailyBudget, businessIntel.avgProjectValue, businessIntel.businessType, businessIntel.yearsInBusiness)
      return {
        leads: roi.leadsPerMonth,
        projects: roi.projectsPerMonth,
        revenue: roi.grossSales,
        roas: roi.roas
      }
    }

    return {
      starter: {
        name: 'Test & Learn',
        range: '$20-60/day',
        dailyBudget: 40,
        description: 'Perfect for new campaigns and market testing',
        expectations: calculateExpectations(40),
        bestFor: 'New to Facebook ads or testing new markets'
      },
      growth: {
        name: 'Scale Ready', 
        range: '$75-150/day',
        dailyBudget: 100,
        description: 'Recommended for proven window contractors',
        expectations: calculateExpectations(100),
        bestFor: 'Established contractors ready to scale'
      },
      dominate: {
        name: 'Market Domination',
        range: '$200-500/day', 
        dailyBudget: 300,
        description: 'Dominate your market with maximum AI reach',
        expectations: calculateExpectations(300),
        bestFor: 'Large contractors or multiple locations'
      }
    }
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
          <div style={{ fontSize: '16px', color: '#a0a9c0' }}>
            Meta Ads Manager Template
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ 
              fontSize: '18px', 
              color: '#a0a9c0',
              marginBottom: '20px' 
            }}>
              Loading your business data...
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 107, 107, 0.3)',
              borderTop: '3px solid #ff6b6b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        ) : (
          <>
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            🚀 Meta Ads Manager Setup
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#a0a9c0',
            marginBottom: '16px',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Meta AI-powered campaigns designed specifically for <strong>{businessName}</strong> in {city}
          </p>
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '16px',
            maxWidth: '600px',
            margin: '16px auto 0'
          }}>
            <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600, marginBottom: '4px' }}>
              ✅ Custom Built for Your Business
            </div>
            <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
              These campaigns use Meta's latest AI features and are optimized for your specific business type, challenges, and goals.
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
            📊 Daily Budget & Performance Projections
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '24px' }}>
            {/* Budget Slider */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
                Daily Ad Spend: ${selectedBudget}/day
              </label>
              <input
                type="range"
                min="20"
                max="500"
                step="20"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)',
                  appearance: 'none',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a0a9c0', marginTop: '4px' }}>
                <span>$20/day</span>
                <span>$500/day</span>
              </div>
              <div style={{ fontSize: '12px', color: '#a0a9c0', textAlign: 'center', marginTop: '4px' }}>
                ≈ ${(selectedBudget * 30).toLocaleString()}/month
              </div>
            </div>
            
            {/* ROI Display */}
            <div>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid #22c55e',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                {(() => {
                  const roi = calculateROI(selectedBudget, businessIntel.avgProjectValue, businessIntel.businessType, businessIntel.yearsInBusiness)
                  return (
                    <>
                      <div style={{ fontSize: '32px', fontWeight: 900, color: '#22c55e', marginBottom: '8px' }}>
                        {roi.roas}:1 ROAS
                      </div>
                      <div style={{ fontSize: '14px', color: '#a0a9c0' }}>
                        ${roi.netProfit?.toLocaleString() || '0'} net profit/month
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
          
          {/* Detailed Projections Table */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            overflow: 'hidden'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
              Expected Performance Breakdown
            </h3>
            {(() => {
              const roi = calculateROI(selectedBudget, businessIntel.avgProjectValue, businessIntel.businessType, businessIntel.yearsInBusiness)
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#ff6b6b' }}>{roi.leadsPerMonth}</div>
                    <div style={{ fontSize: '11px', color: '#a0a9c0' }}>Leads/Month</div>
                    <div style={{ fontSize: '10px', color: '#a0a9c0' }}>${roi.costPerLead}/lead</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#ff6b6b' }}>{roi.projectsPerMonth}</div>
                    <div style={{ fontSize: '11px', color: '#a0a9c0' }}>Projects/Month</div>
                    <div style={{ fontSize: '10px', color: '#a0a9c0' }}>{roi.closeRate}% close rate</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#3b82f6' }}>${(roi.grossSales/1000).toFixed(0)}k</div>
                    <div style={{ fontSize: '11px', color: '#a0a9c0' }}>Gross Sales</div>
                    <div style={{ fontSize: '10px', color: '#a0a9c0' }}>Total revenue</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>${(roi.revenueAfterCOGS/1000).toFixed(0)}k</div>
                    <div style={{ fontSize: '11px', color: '#a0a9c0' }}>After COGS</div>
                    <div style={{ fontSize: '10px', color: '#a0a9c0' }}>50% materials</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>${(roi.netProfit/1000).toFixed(0)}k</div>
                    <div style={{ fontSize: '11px', color: '#a0a9c0' }}>Net Profit</div>
                    <div style={{ fontSize: '10px', color: '#a0a9c0' }}>After ad spend</div>
                  </div>
                </div>
              )
            })()}
            
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px'
            }}>
              <div style={{ fontSize: '12px', color: '#ff6b6b', fontWeight: 600 }}>
                💡 Intelligence Note:
              </div>
              <div style={{ fontSize: '12px', color: '#a0a9c0' }}>
                These projections are based on your business type ({businessIntel.businessType}), experience level, and $
                {(businessIntel.avgProjectValue/1000).toFixed(0)}k average project value. AI Advantage+ typically improves these numbers by 15-25%.
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Overview */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          {(() => {
            const adaptiveCampaign = getAdaptiveCampaign()
            return (
              <>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                  🎯 Your Custom Campaign Strategy
                </h2>
                
                <div style={{
                  padding: '24px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid #22c55e',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, marginBottom: '8px', color: '#22c55e' }}>
                        {adaptiveCampaign.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#a0a9c0', marginBottom: '8px' }}>
                        {adaptiveCampaign.description}
                      </p>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#22c55e' }}>
                        Expected: {adaptiveCampaign.campaign.expectedResults}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>
                        ${adaptiveCampaign.dailyBudget}/day
                      </div>
                      <div style={{ fontSize: '12px', color: '#a0a9c0' }}>
                        {adaptiveCampaign.expectedROI.roas}:1 ROAS
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Features Preview */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px', 
                    padding: '16px',
                    fontSize: '13px',
                    color: '#a0a9c0'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px', color: '#22c55e' }}>🤖 AI Optimization Features:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {adaptiveCampaign.campaign.adSet.advantageFeatures.map((feature, idx) => (
                        <div key={idx} style={{ fontSize: '12px' }}>• {feature}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )
          })()}

          {/* Campaign Details for Facebook Setup */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
              📊 Campaign Details: Facebook Ads Manager Setup
            </h3>
            
            {(() => {
              const adaptiveCampaign = getAdaptiveCampaign()
              const campaign = adaptiveCampaign.campaign
              
              return (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                          {campaign.name}
                        </h4>
                        <div style={{ fontSize: '14px', color: '#a0a9c0', marginTop: '4px' }}>
                          {campaign.campaignType} • {campaign.objective} • {campaign.budget}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`Campaign Name: ${campaign.name}\nType: ${campaign.campaignType}\nObjective: ${campaign.objective}\nBudget: ${campaign.budget}`, 'campaign-details')}
                        style={{
                          background: copiedSection === 'campaign-details' ? '#22c55e' : 'transparent',
                          border: '1px solid #3b82f6',
                          color: copiedSection === 'campaign-details' ? 'white' : '#3b82f6',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {copiedSection === 'campaign-details' ? 'Copied!' : 'Copy Setup'}
                      </button>
                    </div>
                    
                    {/* Facebook Setup Instructions */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#3b82f6' }}>
                        📋 Facebook Ads Manager Settings:
                      </div>
                      <div style={{ fontSize: '13px', color: '#a0a9c0', lineHeight: 1.6 }}>
                        {Object.entries(campaign.adSet.optimizationSettings).map(([key, value], idx) => (
                          <div key={idx} style={{ marginBottom: '4px' }}>• <strong>{key}:</strong> {value}</div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid #22c55e',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      fontSize: '12px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#22c55e' }}>${campaign.dailyBudget}/day</div>
                        <div style={{ color: '#a0a9c0' }}>Daily Budget</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#22c55e' }}>
                          {adaptiveCampaign.expectedROI.leadsPerMonth}
                        </div>
                        <div style={{ color: '#a0a9c0' }}>Expected Leads</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#22c55e' }}>
                          {adaptiveCampaign.expectedROI.roas}:1
                        </div>
                        <div style={{ color: '#a0a9c0' }}>ROAS</div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22c55e',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    marginLeft: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
                        Ad Set: {campaign.adSet.name}
                      </h5>
                      <button
                        onClick={() => copyToClipboard(`Ad Set: ${campaign.adSet.name}\nTargeting: ${campaign.adSet.targeting}\nAds: ${campaign.adSet.ads}`, 'adset-details')}
                        style={{
                          background: copiedSection === 'adset-details' ? '#22c55e' : 'transparent',
                          border: '1px solid #22c55e',
                          color: copiedSection === 'adset-details' ? 'white' : '#22c55e',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedSection === 'adset-details' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ fontSize: '13px', color: '#a0a9c0', marginBottom: '8px' }}>
                      <strong>Targeting:</strong> {campaign.adSet.targeting}
                    </div>
                    <div style={{ fontSize: '13px', color: '#a0a9c0', marginBottom: '12px' }}>
                      <strong>Creative:</strong> {campaign.adSet.ads}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* Advantage+ Targeting Guide */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
            🎯 Advantage+ Targeting Setup
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid #3b82f6',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#3b82f6' }}>
                📊 Demographics (Your Starting Point)
              </h3>
              <div style={{ fontSize: '14px', color: '#a0a9c0', lineHeight: 1.6 }}>
                <div><strong>Age:</strong> 35-65 (prime window replacement age)</div>
                <div><strong>Income:</strong> $75,000+ household income</div>
                <div><strong>Housing:</strong> Homeowners only</div>
                <div><strong>Location:</strong> {city} + 25 mile radius</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid #22c55e',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#22c55e' }}>
                🤖 How Advantage+ Targeting Works
              </h3>
              <div style={{ fontSize: '14px', color: '#a0a9c0', lineHeight: 1.6 }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong>✅ Start with basic demographics above</strong> - This gives Meta AI a foundation to work with
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>✅ Enable "Advantage Detailed Targeting"</strong> - AI expands beyond your initial audience to find similar high-converting users
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>✅ Meta AI automatically finds:</strong> People who behave like your best customers, even if they don't match your exact targeting criteria
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong>✅ Real-time optimization:</strong> The system learns from conversions and adjusts targeting throughout the campaign
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '14px', color: '#ff6b6b', fontWeight: 600, marginBottom: '8px' }}>
              📚 Learn More About Advantage+ Targeting
            </div>
            <div style={{ fontSize: '13px', color: '#a0a9c0' }}>
              For detailed setup instructions and best practices, visit the{' '}
              <a 
                href="https://www.facebook.com/business/help/2172932432978961" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#ff6b6b', textDecoration: 'underline' }}
              >
                Facebook Advantage+ Documentation
              </a>
              {' '}to understand how Meta's AI targeting algorithms work.
            </div>
          </div>
        </div>

        {/* Budget Guide */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
            💰 Budget Recommendations for {city}
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {Object.values(getBudgetRecommendations()).map((budget, index) => (
              <div key={index} style={{
                padding: '20px',
                background: selectedBudget >= (budget.dailyBudget - 20) && selectedBudget <= (budget.dailyBudget + 20) 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: selectedBudget >= (budget.dailyBudget - 20) && selectedBudget <= (budget.dailyBudget + 20) 
                  ? '2px solid #22c55e' 
                  : '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                      {budget.name}
                    </h3>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#ff6b6b', marginTop: '4px' }}>
                      {budget.range}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#22c55e' }}>
                      {budget.expectations.roas}:1 ROAS
                    </div>
                    <div style={{ fontSize: '12px', color: '#a0a9c0' }}>
                      {budget.expectations.leads} leads/month
                    </div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#a0a9c0', marginBottom: '8px' }}>
                  {budget.description}
                </p>
                <div style={{ fontSize: '13px', color: '#a0a9c0', marginBottom: '12px' }}>
                  <strong>Best for:</strong> {budget.bestFor}
                </div>
                
                {/* Performance Expectations */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#3b82f6' }}>{budget.expectations.leads}</div>
                    <div style={{ color: '#a0a9c0' }}>Leads/Month</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#f59e0b' }}>{budget.expectations.projects}</div>
                    <div style={{ color: '#a0a9c0' }}>Projects/Month</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#22c55e' }}>${(budget.expectations.revenue/1000).toFixed(0)}k</div>
                    <div style={{ color: '#a0a9c0' }}>Revenue/Month</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Advantage+ Implementation Guide */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
            🚀 Launch in 4 Simple Steps
          </h2>
          
          <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
            {[
              {
                step: 1,
                title: 'Create Campaign',
                description: 'Go to Meta Ads Manager → Create → Leads → Choose "Advantage+ Leads Campaign"',
                highlight: 'Select Advantage+ for AI optimization'
              },
              {
                step: 2, 
                title: 'Set Daily Budget',
                description: `Set daily budget to $${selectedBudget} and select "Campaign Budget Optimization"`,
                highlight: 'AI allocates budget automatically'
              },
              {
                step: 3,
                title: 'Upload Creative',
                description: 'Add your 12 strategic ad variations → Enable "Advantage+ Creative"',
                highlight: 'AI tests all variations'
              },
              {
                step: 4,
                title: 'Enable Smart Targeting',
                description: 'Set basic targeting (35-65, homeowners) → Turn ON "Advantage Detailed Targeting"',
                highlight: 'AI expands to best audiences'
              }
            ].map((item) => (
              <div key={item.step} style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#a0a9c0', marginBottom: '4px' }}>
                    {item.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#ff6b6b', fontWeight: 600 }}>
                    💡 {item.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          background: 'rgba(255, 107, 107, 0.1)',
          border: '2px solid #ff6b6b',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', color: '#ff6b6b' }}>
            🚀 Ready to Launch Your Campaign?
          </h2>
          <p style={{ fontSize: '16px', color: '#a0a9c0', marginBottom: '8px' }}>
            Expected Results: {(() => {
              const roi = calculateROI(selectedBudget, businessIntel.avgProjectValue, businessIntel.businessType, businessIntel.yearsInBusiness)
              return `${roi.leadsPerMonth} leads/month at ${roi.roas}:1 ROAS`
            })()} 
          </p>
          <p style={{ fontSize: '14px', color: '#a0a9c0', marginBottom: '24px' }}>
            Based on ${selectedBudget}/day with Meta AI optimization for {businessName}
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://adsmanager.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🤖 Launch in Meta Ads Manager
            </a>
            <a
              href={`/my-campaigns?session_id=${sessionId || 'test_session'}`}
              style={{
                background: 'transparent',
                color: '#ff6b6b',
                border: '2px solid #ff6b6b',
                padding: '16px 32px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Back to Dashboard
            </a>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '24px',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600, marginBottom: '8px' }}>
              🧠 Why This Works Better Than Generic Templates:
            </div>
            <div style={{ fontSize: '13px', color: '#a0a9c0', lineHeight: 1.5 }}>
              • <strong>AI-Selected Angles:</strong> Based on your business challenges, not random messaging<br />
              • <strong>Smart Budget Allocation:</strong> Meta AI optimizes spend across your best-performing ads<br />
              • <strong>Audience Intelligence:</strong> Finds customers similar to your best clients automatically<br />
              • <strong>Financial Projections:</strong> ROI calculations based on your actual business data
            </div>
          </div>
        </div>

        {/* Done-With-You / Done-For-You Upsell */}
        <div style={{
          background: 'linear-gradient(145deg, #1a1f3a 0%, #2d3561 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
            🚀 Need Help Getting Results Faster?
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Done-With-You Service */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid #3b82f6',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#3b82f6' }}>
                🤝 Done-With-You Setup
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#3b82f6' }}>
                $497 One-Time
              </div>
              <div style={{ fontSize: '14px', color: '#a0a9c0', marginBottom: '20px', lineHeight: 1.6 }}>
                We'll personally guide you through setting up your first campaign in a 1-hour screen share session.
              </div>
              
              <div style={{ fontSize: '13px', color: '#a0a9c0', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', color: '#3b82f6' }}>What's Included:</div>
                <div>• Live 1-hour setup session</div>
                <div>• Campaign optimization review</div>
                <div>• Creative upload assistance</div>
                <div>• Targeting setup guidance</div>
                <div>• 30-day follow-up support</div>
              </div>
              
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%'
              }}>
                Book Setup Session
              </button>
            </div>

            {/* Done-For-You Service */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                background: '#ff6b6b',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                MOST POPULAR
              </div>
              
              <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#22c55e' }}>
                ✅ Done-For-You Management
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#22c55e' }}>
                $997/month
              </div>
              <div style={{ fontSize: '14px', color: '#a0a9c0', marginBottom: '20px', lineHeight: 1.6 }}>
                We handle everything - campaign setup, optimization, creative updates, and monthly performance reports.
              </div>
              
              <div style={{ fontSize: '13px', color: '#a0a9c0', textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', color: '#22c55e' }}>Everything Included:</div>
                <div>• Complete campaign setup & management</div>
                <div>• Monthly creative refresh</div>
                <div>• Bi-weekly optimization</div>
                <div>• Detailed performance reports</div>
                <div>• Dedicated account manager</div>
                <div>• Guaranteed 3:1 ROAS or money back</div>
              </div>
              
              <button style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%'
              }}>
                Start Managed Service
              </button>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#ff6b6b', fontWeight: 600, marginBottom: '8px' }}>
              💼 Enterprise Solutions Available
            </div>
            <div style={{ fontSize: '13px', color: '#a0a9c0' }}>
              Multiple locations? Need white-label services? Contact us for custom pricing and agency partnerships.
            </div>
          </div>
        </div>
        </>
        )}
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