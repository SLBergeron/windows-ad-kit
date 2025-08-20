import { NextRequest, NextResponse } from 'next/server'

interface FollowUpTriggerData {
  leadId: string
  leadScore: number
  qualificationStatus: string
  contactMethod: 'sms' | 'email' | 'call' | 'auto'
  sequenceType: 'immediate' | 'nurture' | 'qualification' | 'appointment_booking'
  customMessage?: string
  scheduledTime?: string // ISO string for delayed sends
}

interface FollowUpSequence {
  id: string
  name: string
  triggers: Array<{
    delay: number // minutes
    method: 'sms' | 'email' | 'call_reminder'
    template: string
    conditions?: any
  }>
}

// Pre-built follow-up sequences based on lead score and status
const FOLLOW_UP_SEQUENCES: Record<string, FollowUpSequence> = {
  hot_lead_immediate: {
    id: 'hot_lead_immediate',
    name: 'Hot Lead - Immediate Response',
    triggers: [
      {
        delay: 1, // 1 minute
        method: 'sms',
        template: 'immediate_response_sms'
      },
      {
        delay: 5, // 5 minutes
        method: 'call_reminder',
        template: 'call_reminder_contractor'
      },
      {
        delay: 15, // 15 minutes if no response
        method: 'email',
        template: 'detailed_follow_up_email'
      },
      {
        delay: 60, // 1 hour
        method: 'sms',
        template: 'appointment_booking_sms'
      }
    ]
  },
  warm_lead_standard: {
    id: 'warm_lead_standard',
    name: 'Warm Lead - Standard Follow-up',
    triggers: [
      {
        delay: 5, // 5 minutes
        method: 'email',
        template: 'welcome_email_with_portfolio'
      },
      {
        delay: 30, // 30 minutes
        method: 'sms',
        template: 'qualification_questions_sms'
      },
      {
        delay: 120, // 2 hours
        method: 'call_reminder',
        template: 'call_reminder_contractor'
      },
      {
        delay: 1440, // 24 hours
        method: 'email',
        template: 'case_studies_email'
      }
    ]
  },
  qualified_nurture: {
    id: 'qualified_nurture',
    name: 'Qualified Lead - Nurture Sequence',
    triggers: [
      {
        delay: 15, // 15 minutes
        method: 'email',
        template: 'educational_content_email'
      },
      {
        delay: 180, // 3 hours
        method: 'sms',
        template: 'value_proposition_sms'
      },
      {
        delay: 1440, // 24 hours
        method: 'email',
        template: 'scheduling_options_email'
      },
      {
        delay: 4320, // 3 days
        method: 'sms',
        template: 'limited_time_offer_sms'
      }
    ]
  },
  needs_qualification: {
    id: 'needs_qualification',
    name: 'Needs Qualification - Information Gathering',
    triggers: [
      {
        delay: 30, // 30 minutes
        method: 'email',
        template: 'qualification_form_email'
      },
      {
        delay: 240, // 4 hours
        method: 'sms',
        template: 'quick_questions_sms'
      },
      {
        delay: 1440, // 24 hours
        method: 'email',
        template: 'educational_series_part1'
      },
      {
        delay: 4320, // 3 days
        method: 'sms',
        template: 'check_in_sms'
      }
    ]
  }
}

// Message templates
const MESSAGE_TEMPLATES = {
  immediate_response_sms: {
    subject: '',
    content: 'Hi {name}! Thanks for your interest in new windows. I received your request and will call you within the next few minutes to discuss your project. - {contractorName}'
  },
  detailed_follow_up_email: {
    subject: 'Your Window Replacement Project - {contractorName}',
    content: `Hi {name},

Thank you for your interest in window replacement! I wanted to reach out personally about your project in {city}.

Based on your inquiry, I understand you're looking at replacing {windowCount} windows. I'd love to schedule a free consultation to:

✓ Assess your current windows
✓ Show you energy-efficient options
✓ Provide an accurate quote

I have availability this week - would you prefer morning or afternoon?

Best regards,
{contractorName}
{contractorPhone}

P.S. As a local {city} contractor, I guarantee all my work and offer financing options.`
  },
  qualification_questions_sms: {
    subject: '',
    content: 'Quick question about your window project: Are you the homeowner and looking to move forward in the next 3 months? This helps me prioritize your quote. Reply YES or NO. -{contractorName}'
  },
  appointment_booking_sms: {
    subject: '',
    content: 'Hi {name}! I have time slots available this week for your free window consultation. Click here to book: {bookingLink} or call me at {contractorPhone}. -{contractorName}'
  },
  welcome_email_with_portfolio: {
    subject: 'Welcome {name} - See Our Recent {city} Window Projects',
    content: `Hi {name},

Welcome! I'm excited to help with your window project.

I've attached photos of recent installations in {city} so you can see the quality of our work. Here's what makes us different:

🏠 Local {city} contractor (not a big box store)
⚡ Energy-efficient windows that cut utility bills
💰 Flexible financing options available
🛡️ Lifetime warranty on installations

I'll call you within 24 hours to schedule your free consultation.

View our portfolio: {portfolioLink}

{contractorName}
{contractorPhone}`
  },
  case_studies_email: {
    subject: 'How We Saved {city} Homeowners $200+ Monthly',
    content: `Hi {name},

I wanted to share some real results from recent {city} customers:

📊 The Johnsons (Oak Street): Cut their heating bill by $230/month
📊 The Chens (Maple Ave): Eliminated drafts and noise issues
📊 The Williams (Pine Road): Increased home value by $15,000

Each project included:
✓ Free energy audit
✓ Professional installation
✓ Lifetime warranty

Ready to see similar savings at your home?

Book your free consultation: {bookingLink}

{contractorName}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const triggerData: FollowUpTriggerData = await request.json()
    
    const { leadId, leadScore, qualificationStatus, contactMethod, sequenceType } = triggerData
    
    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Determine the appropriate sequence
    const sequenceId = determineSequence(leadScore, qualificationStatus, sequenceType)
    const sequence = FOLLOW_UP_SEQUENCES[sequenceId]
    
    if (!sequence) {
      return NextResponse.json(
        { error: 'No sequence found for lead criteria' },
        { status: 400 }
      )
    }

    // Schedule all follow-up messages in the sequence
    const scheduledFollowUps = []
    const now = new Date()
    
    for (const trigger of sequence.triggers) {
      const scheduledTime = new Date(now.getTime() + trigger.delay * 60000)
      
      const followUp = {
        id: `followup_${leadId}_${trigger.delay}`,
        leadId,
        sequenceId,
        method: trigger.method,
        template: trigger.template,
        scheduledTime: scheduledTime.toISOString(),
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }
      
      scheduledFollowUps.push(followUp)
      
      // TODO: Schedule actual message sending
      // This would integrate with SMS/email services
      await scheduleMessage(followUp)
    }

    // Log the trigger event
    console.log('📅 Follow-up sequence triggered:', {
      leadId,
      sequenceId,
      totalMessages: scheduledFollowUps.length,
      firstMessageAt: scheduledFollowUps[0]?.scheduledTime
    })

    return NextResponse.json({
      success: true,
      leadId,
      sequenceId: sequence.id,
      sequenceName: sequence.name,
      scheduledFollowUps: scheduledFollowUps.length,
      nextFollowUpAt: scheduledFollowUps[0]?.scheduledTime,
      followUpPlan: scheduledFollowUps.map(f => ({
        method: f.method,
        scheduledTime: f.scheduledTime,
        template: f.template
      }))
    })

  } catch (error) {
    console.error('Follow-up trigger error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger follow-up sequence' },
      { status: 500 }
    )
  }
}

function determineSequence(score: number, qualification: string, preferredType?: string): string {
  if (preferredType && FOLLOW_UP_SEQUENCES[preferredType]) {
    return preferredType
  }
  
  // Auto-determine based on lead quality
  if (score >= 80 || qualification === 'hot') {
    return 'hot_lead_immediate'
  } else if (score >= 60 || qualification === 'warm') {
    return 'warm_lead_standard'
  } else if (score >= 40 || qualification === 'qualified') {
    return 'qualified_nurture'
  } else {
    return 'needs_qualification'
  }
}

async function scheduleMessage(followUp: any) {
  // TODO: Integrate with actual messaging services
  console.log('📨 Scheduling message:', {
    id: followUp.id,
    method: followUp.method,
    template: followUp.template,
    scheduledTime: followUp.scheduledTime
  })
  
  // This would integrate with:
  // - Twilio for SMS
  // - SendGrid/AWS SES for email
  // - Calendar service for call reminders
  // - Background job queue for scheduling
}

// API endpoint to get available sequences
export async function GET(request: NextRequest) {
  try {
    const sequences = Object.values(FOLLOW_UP_SEQUENCES).map(seq => ({
      id: seq.id,
      name: seq.name,
      triggerCount: seq.triggers.length,
      duration: Math.max(...seq.triggers.map(t => t.delay))
    }))

    return NextResponse.json({
      success: true,
      sequences,
      templates: Object.keys(MESSAGE_TEMPLATES)
    })

  } catch (error) {
    console.error('Get sequences error:', error)
    return NextResponse.json(
      { error: 'Failed to get sequences' },
      { status: 500 }
    )
  }
}