export interface Customer {
  id: string
  business_name: string
  city: string
  email: string
  stripe_customer_id: string
  stripe_session_id: string
  status: 'active' | 'inactive' | 'cancelled'
  created_at: string
  updated_at: string
  billing_address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  shipping_address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export interface Campaign {
  id: string
  customer_id: string
  name: string
  type: 'winter_special' | 'energy_savings' | 'emergency_repair'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: number
  appointments_booked: number
  cost_per_appointment: number
  revenue_generated: number
  created_at: string
  updated_at: string
  launches_at?: string
  ends_at?: string
}

export interface Appointment {
  id: string
  customer_id: string
  campaign_id: string
  lead_name: string
  lead_email?: string
  lead_phone: string
  appointment_date: string
  appointment_type: 'estimate' | 'consultation' | 'installation'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  estimated_value: number
  actual_value?: number
  notes?: string
  created_at: string
  updated_at: string
}

// Database helper types
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Customer, 'id' | 'created_at'>>
      }
      campaigns: {
        Row: Campaign
        Insert: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Campaign, 'id' | 'created_at'>>
      }
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Appointment, 'id' | 'created_at'>>
      }
    }
  }
}