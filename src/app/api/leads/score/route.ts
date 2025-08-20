import { NextRequest, NextResponse } from 'next/server'

interface LeadScoringData {
  // Contact completeness
  hasEmail: boolean
  hasAddress: boolean
  hasZipCode: boolean
  
  // Project details
  hasProjectType: boolean
  hasWindowCount: boolean
  hasDoorCount: boolean
  hasBudget: boolean
  budgetRange?: string
  
  // Qualification factors
  isHomeowner: boolean
  hasDecisionAuthority: boolean
  currentWindowAge?: string
  
  // Urgency and timing
  timeframe: string
  primaryMotivation: string
  
  // Source quality
  source: string
  hasReferral: boolean
  
  // Behavioral indicators
  formCompletionTime?: number // seconds
  pagesViewed?: number
  timeOnSite?: number // seconds
  returnVisitor: boolean
  
  // Demographics (if available)
  homeValue?: number
  householdIncome?: string
  homeAge?: number
}

interface ScoringWeights {
  contactCompleteness: number
  projectClarity: number
  qualification: number
  urgency: number
  sourceQuality: number
  engagement: number
  demographics: number
}

const SCORING_WEIGHTS: ScoringWeights = {
  contactCompleteness: 20,
  projectClarity: 25,
  qualification: 20,
  urgency: 15,
  sourceQuality: 10,
  engagement: 5,
  demographics: 5
}

export async function POST(request: NextRequest) {
  try {
    const { leadId, scoringData }: { leadId: string; scoringData: LeadScoringData } = await request.json()
    
    if (!leadId || !scoringData) {
      return NextResponse.json(
        { error: 'Lead ID and scoring data are required' },
        { status: 400 }
      )
    }

    // Calculate component scores
    const scores = {
      contactCompleteness: calculateContactScore(scoringData),
      projectClarity: calculateProjectScore(scoringData),
      qualification: calculateQualificationScore(scoringData),
      urgency: calculateUrgencyScore(scoringData),
      sourceQuality: calculateSourceScore(scoringData),
      engagement: calculateEngagementScore(scoringData),
      demographics: calculateDemographicsScore(scoringData)
    }

    // Calculate weighted total score
    const totalScore = Object.entries(scores).reduce((total, [component, score]) => {
      const weight = SCORING_WEIGHTS[component as keyof ScoringWeights]
      return total + (score * weight / 100)
    }, 0)

    // Determine lead grade and priority
    const leadGrade = determineLeadGrade(totalScore)
    const priority = determinePriority(totalScore, scoringData)
    const recommendedActions = getRecommendedActions(totalScore, scoringData, scores)

    // Calculate estimated conversion probability
    const conversionProbability = calculateConversionProbability(totalScore, scoringData)

    return NextResponse.json({
      success: true,
      leadId,
      totalScore: Math.round(totalScore),
      leadGrade,
      priority,
      conversionProbability,
      componentScores: scores,
      recommendedActions,
      scoringBreakdown: generateScoringBreakdown(scores, SCORING_WEIGHTS),
    })

  } catch (error) {
    console.error('Lead scoring error:', error)
    return NextResponse.json(
      { error: 'Failed to score lead' },
      { status: 500 }
    )
  }
}

function calculateContactScore(data: LeadScoringData): number {
  let score = 40 // Base score for having name and phone
  
  if (data.hasEmail) score += 25
  if (data.hasAddress) score += 20
  if (data.hasZipCode) score += 15
  
  return Math.min(100, score)
}

function calculateProjectScore(data: LeadScoringData): number {
  let score = 0
  
  if (data.hasProjectType) score += 20
  if (data.hasWindowCount) score += 25
  if (data.hasDoorCount) score += 15
  if (data.hasBudget) {
    score += 40
    // Bonus for higher budget ranges
    if (data.budgetRange?.includes('10000+')) score += 20
    else if (data.budgetRange?.includes('5000-8000')) score += 10
  }
  
  return Math.min(100, score)
}

function calculateQualificationScore(data: LeadScoringData): number {
  let score = 0
  
  if (data.isHomeowner) score += 50
  if (data.hasDecisionAuthority) score += 30
  
  // Window age indicates replacement urgency
  if (data.currentWindowAge) {
    if (data.currentWindowAge.includes('20+')) score += 20
    else if (data.currentWindowAge.includes('15-20')) score += 15
    else if (data.currentWindowAge.includes('10-15')) score += 10
  }
  
  return Math.min(100, score)
}

function calculateUrgencyScore(data: LeadScoringData): number {
  let score = 20 // Base score
  
  // Timeline urgency
  switch (data.timeframe) {
    case 'asap': score += 50; break
    case '1-3_months': score += 30; break
    case '3-6_months': score += 15; break
    case '6_months_plus': score += 5; break
  }
  
  // Motivation quality
  switch (data.primaryMotivation) {
    case 'energy_savings': score += 25; break
    case 'security': score += 20; break
    case 'maintenance': score += 15; break
    case 'aesthetics': score += 10; break
  }
  
  return Math.min(100, score)
}

function calculateSourceScore(data: LeadScoringData): number {
  let score = 20 // Base score
  
  if (data.hasReferral) score += 60
  else {
    switch (data.source) {
      case 'google': score += 30; break
      case 'facebook': score += 20; break
      case 'landing_page': score += 25; break
      case 'email': score += 15; break
      default: score += 10; break
    }
  }
  
  return Math.min(100, score)
}

function calculateEngagementScore(data: LeadScoringData): number {
  let score = 20 // Base score
  
  if (data.returnVisitor) score += 20
  
  if (data.formCompletionTime) {
    // Longer completion time suggests more consideration
    if (data.formCompletionTime > 300) score += 25 // 5+ minutes
    else if (data.formCompletionTime > 120) score += 15 // 2+ minutes
    else if (data.formCompletionTime > 60) score += 10 // 1+ minute
  }
  
  if (data.pagesViewed && data.pagesViewed > 3) score += 15
  if (data.timeOnSite && data.timeOnSite > 180) score += 20 // 3+ minutes
  
  return Math.min(100, score)
}

function calculateDemographicsScore(data: LeadScoringData): number {
  let score = 50 // Base score
  
  if (data.homeValue) {
    if (data.homeValue > 500000) score += 30
    else if (data.homeValue > 300000) score += 20
    else if (data.homeValue > 200000) score += 10
  }
  
  if (data.householdIncome) {
    if (data.householdIncome.includes('100000+')) score += 20
    else if (data.householdIncome.includes('75000-100000')) score += 10
  }
  
  return Math.min(100, score)
}

function determineLeadGrade(score: number): string {
  if (score >= 85) return 'A+'
  if (score >= 75) return 'A'
  if (score >= 65) return 'B+'
  if (score >= 55) return 'B'
  if (score >= 45) return 'C+'
  if (score >= 35) return 'C'
  return 'D'
}

function determinePriority(score: number, data: LeadScoringData): string {
  if (score >= 80) return 'immediate'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

function calculateConversionProbability(score: number, data: LeadScoringData): number {
  let baseProbability = score / 100 * 0.6 // Base conversion rate
  
  // Adjust based on specific factors
  if (data.hasReferral) baseProbability += 0.2
  if (data.timeframe === 'asap') baseProbability += 0.15
  if (data.isHomeowner && data.hasDecisionAuthority) baseProbability += 0.1
  
  return Math.min(0.95, Math.max(0.05, baseProbability))
}

function getRecommendedActions(score: number, data: LeadScoringData, scores: any): string[] {
  const actions = []
  
  if (score >= 80) {
    actions.push('Call within 5 minutes')
    actions.push('Send immediate SMS confirmation')
    actions.push('Schedule appointment ASAP')
  } else if (score >= 60) {
    actions.push('Call within 1 hour')
    actions.push('Send follow-up email with portfolio')
    actions.push('Qualify budget and timeline')
  } else if (score >= 40) {
    actions.push('Call within 24 hours')
    actions.push('Send educational content')
    actions.push('Nurture with email sequence')
  } else {
    actions.push('Add to long-term nurture sequence')
    actions.push('Gather more qualification data')
  }
  
  // Specific recommendations based on missing data
  if (scores.contactCompleteness < 60) {
    actions.push('Collect missing contact information')
  }
  if (scores.projectClarity < 50) {
    actions.push('Qualify project scope and budget')
  }
  if (!data.isHomeowner || !data.hasDecisionAuthority) {
    actions.push('Verify decision-making authority')
  }
  
  return actions
}

function generateScoringBreakdown(scores: any, weights: ScoringWeights): any {
  return Object.entries(scores).map(([component, score]) => ({
    component,
    score,
    weight: weights[component as keyof ScoringWeights],
    weightedScore: score * weights[component as keyof ScoringWeights] / 100,
    description: getComponentDescription(component)
  }))
}

function getComponentDescription(component: string): string {
  const descriptions = {
    contactCompleteness: 'How complete is the contact information',
    projectClarity: 'How well-defined is the project scope',
    qualification: 'Buyer authority and homeowner status',
    urgency: 'Timeline and motivation indicators',
    sourceQuality: 'Quality of lead source channel',
    engagement: 'Website engagement and behavior',
    demographics: 'Income and property value indicators'
  }
  return descriptions[component as keyof typeof descriptions] || component
}