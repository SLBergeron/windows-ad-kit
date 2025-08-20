import { NextRequest, NextResponse } from 'next/server'

interface LeadCaptureData {
  // Contact Information
  name: string
  email?: string
  phone: string
  address?: string
  city: string
  state?: string
  zipCode?: string
  
  // Lead Source Data
  campaignId?: string
  campaignName?: string
  adId?: string
  adName?: string
  source: string // 'facebook', 'google', 'landing_page', 'referral'
  medium?: string // 'cpc', 'organic', 'email', 'social'
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  
  // Project Details
  projectType?: string // 'replacement', 'new_construction', 'repair'
  windowCount?: number
  doorCount?: number
  estimatedBudget?: string
  timeframe?: string // 'asap', '1-3_months', '3-6_months', '6_months_plus'
  
  // Lead Qualification
  isHomeowner?: boolean
  hasDecisionMakingAuthority?: boolean
  currentWindowAge?: string
  primaryMotivation?: string // 'energy_savings', 'aesthetics', 'security', 'maintenance'
  
  // Metadata
  ipAddress?: string
  userAgent?: string
  referrerUrl?: string
  landingPageUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    const leadData: LeadCaptureData = await request.json()
    
    // Validate required fields
    if (!leadData.name || !leadData.phone || !leadData.city || !leadData.source) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, city, source' },
        { status: 400 }
      )
    }

    // Calculate lead score
    const leadScore = calculateLeadScore(leadData)
    
    // Generate unique lead ID
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    // Create lead object
    const lead = {
      id: leadId,
      ...leadData,
      score: leadScore,
      status: 'new',
      createdAt: new Date().toISOString(),
      lastContactedAt: null,
      nextFollowUpAt: calculateNextFollowUp(),
      interactions: [],
      notes: [],
      qualificationStatus: determineQualificationStatus(leadData, leadScore),
    }

    // TODO: Save to database
    console.log('💎 New lead captured:', {
      id: leadId,
      name: leadData.name,
      phone: leadData.phone,
      source: leadData.source,
      score: leadScore,
      qualification: lead.qualificationStatus
    })

    // TODO: Trigger real-time notifications
    // - SMS to contractor
    // - Email alert
    // - Push notification
    
    // TODO: Start automated follow-up sequence
    await triggerInitialFollowUp(lead)

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead captured successfully',
      leadScore,
      qualificationStatus: lead.qualificationStatus,
      nextFollowUpAt: lead.nextFollowUpAt,
    })

  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture lead' },
      { status: 500 }
    )
  }
}

function calculateLeadScore(leadData: LeadCaptureData): number {
  let score = 50 // Base score
  
  // Contact completeness
  if (leadData.email) score += 10
  if (leadData.address) score += 5
  if (leadData.zipCode) score += 5
  
  // Project details provided
  if (leadData.projectType) score += 15
  if (leadData.windowCount && leadData.windowCount > 0) score += 10
  if (leadData.doorCount && leadData.doorCount > 0) score += 5
  if (leadData.estimatedBudget) score += 20
  
  // Qualification factors
  if (leadData.isHomeowner) score += 15
  if (leadData.hasDecisionMakingAuthority) score += 10
  
  // Urgency indicators
  if (leadData.timeframe === 'asap') score += 25
  else if (leadData.timeframe === '1-3_months') score += 15
  else if (leadData.timeframe === '3-6_months') score += 5
  
  // Motivation quality
  if (leadData.primaryMotivation === 'energy_savings') score += 10
  else if (leadData.primaryMotivation === 'security') score += 8
  else if (leadData.primaryMotivation === 'maintenance') score += 5
  
  // Source quality
  if (leadData.source === 'referral') score += 20
  else if (leadData.source === 'google') score += 10
  else if (leadData.source === 'facebook') score += 5
  
  return Math.min(100, Math.max(0, score))
}

function determineQualificationStatus(leadData: LeadCaptureData, score: number): string {
  if (score >= 80) return 'hot'
  if (score >= 60) return 'warm'
  if (score >= 40) return 'qualified'
  return 'needs_qualification'
}

function calculateNextFollowUp(): string {
  // Schedule first follow-up for 5 minutes from now
  const followUpTime = new Date()
  followUpTime.setMinutes(followUpTime.getMinutes() + 5)
  return followUpTime.toISOString()
}

async function triggerInitialFollowUp(lead: any) {
  // TODO: Implement automated follow-up triggers
  console.log('🚀 Triggering initial follow-up for lead:', lead.id)
  
  // This would trigger:
  // 1. Immediate SMS to contractor about new lead
  // 2. Lead qualification questions via SMS/email
  // 3. Appointment scheduling link
  // 4. Follow-up sequence based on lead score
}