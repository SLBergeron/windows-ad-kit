-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
  billing_address JSONB,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('winter_special', 'energy_savings', 'emergency_repair')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  budget DECIMAL(10,2) DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  cost_per_appointment DECIMAL(10,2) DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  launches_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_name VARCHAR(255) NOT NULL,
  lead_email VARCHAR(255),
  lead_phone VARCHAR(20) NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_type VARCHAR(20) NOT NULL CHECK (appointment_type IN ('estimate', 'consultation', 'installation')),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  estimated_value DECIMAL(10,2) DEFAULT 0,
  actual_value DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX idx_customers_stripe_session_id ON customers(stripe_session_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_campaigns_customer_id ON campaigns(customer_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_appointments_campaign_id ON appointments(campaign_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies (customers can only see their own data)
CREATE POLICY "Customers can view own data" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can view own campaigns" ON campaigns
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM customers WHERE customers.id = campaigns.customer_id AND customers.id::text = auth.uid()::text
  ));

CREATE POLICY "Customers can view own appointments" ON appointments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM customers WHERE customers.id = appointments.customer_id AND customers.id::text = auth.uid()::text
  ));