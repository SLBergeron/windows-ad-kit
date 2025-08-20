-- Meta Integration Tables
-- Stores Meta Business Manager connections and campaign data

-- Meta Business Manager connections
CREATE TABLE IF NOT EXISTS meta_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    meta_user_id TEXT NOT NULL,
    meta_user_name TEXT NOT NULL,
    meta_user_email TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    business_accounts JSONB DEFAULT '[]',
    scopes TEXT[] DEFAULT '{}',
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(customer_id, meta_user_id)
);

-- Meta campaigns uploaded to Facebook Ads Manager
CREATE TABLE IF NOT EXISTS meta_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    meta_connection_id UUID NOT NULL REFERENCES meta_connections(id) ON DELETE CASCADE,
    meta_campaign_id TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    objective TEXT NOT NULL,
    daily_budget INTEGER NOT NULL, -- Budget in cents
    status TEXT DEFAULT 'PAUSED' CHECK (status IN ('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED')),
    ad_account_id TEXT NOT NULL,
    business_id TEXT,
    
    -- Campaign structure and metadata
    campaign_structure JSONB DEFAULT '{}', -- Stores ad sets, ads, creatives
    targeting_config JSONB DEFAULT '{}',
    safety_settings JSONB DEFAULT '{}',
    
    -- Performance tracking
    total_spend INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    cost_per_click DECIMAL(10,2),
    cost_per_conversion DECIMAL(10,2),
    
    -- Timestamps
    launched_at TIMESTAMP WITH TIME ZONE,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(meta_connection_id, meta_campaign_id)
);

-- Campaign performance insights (daily snapshots)
CREATE TABLE IF NOT EXISTS meta_campaign_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meta_campaign_id UUID NOT NULL REFERENCES meta_campaigns(id) ON DELETE CASCADE,
    insight_date DATE NOT NULL,
    
    -- Performance metrics
    spend INTEGER NOT NULL DEFAULT 0, -- Spend in cents
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    frequency DECIMAL(10,2),
    
    -- Calculated metrics
    cpm DECIMAL(10,2), -- Cost per 1000 impressions
    cpc DECIMAL(10,2), -- Cost per click
    ctr DECIMAL(5,4), -- Click-through rate
    conversion_rate DECIMAL(5,4),
    cost_per_conversion DECIMAL(10,2),
    
    -- Metadata
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(meta_campaign_id, insight_date)
);

-- Lead capture from Meta Lead Ads
CREATE TABLE IF NOT EXISTS meta_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meta_campaign_id UUID NOT NULL REFERENCES meta_campaigns(id) ON DELETE CASCADE,
    meta_lead_id TEXT NOT NULL,
    meta_form_id TEXT,
    
    -- Lead information
    lead_data JSONB NOT NULL DEFAULT '{}', -- Raw lead form data
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_address TEXT,
    
    -- Lead qualification
    project_type TEXT,
    budget_range TEXT,
    timeline TEXT,
    lead_score INTEGER DEFAULT 0,
    lead_quality TEXT DEFAULT 'unqualified' CHECK (lead_quality IN ('hot', 'warm', 'cold', 'unqualified')),
    
    -- Follow-up tracking
    contacted_at TIMESTAMP WITH TIME ZONE,
    appointment_scheduled BOOLEAN DEFAULT FALSE,
    appointment_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'appointment', 'quoted', 'won', 'lost')),
    
    -- Timestamps
    lead_created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(meta_lead_id)
);

-- Campaign automation rules and triggers
CREATE TABLE IF NOT EXISTS meta_automation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meta_campaign_id UUID NOT NULL REFERENCES meta_campaigns(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('budget_protection', 'performance_optimization', 'schedule', 'pause_trigger')),
    
    -- Rule configuration
    conditions JSONB NOT NULL DEFAULT '{}', -- When to trigger
    actions JSONB NOT NULL DEFAULT '{}', -- What to do
    
    -- Rule status
    enabled BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign action logs for emergency controls and audit trail
CREATE TABLE IF NOT EXISTS campaign_action_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    meta_campaign_id UUID REFERENCES meta_campaigns(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('pause', 'resume', 'adjust_budget', 'emergency_stop', 'delete', 'create')),
    action_data JSONB DEFAULT '{}',
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meta_connections_customer_id ON meta_connections(customer_id);
CREATE INDEX IF NOT EXISTS idx_meta_connections_status ON meta_connections(status);
CREATE INDEX IF NOT EXISTS idx_meta_campaigns_customer_id ON meta_campaigns(customer_id);
CREATE INDEX IF NOT EXISTS idx_meta_campaigns_status ON meta_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_meta_campaign_insights_campaign_date ON meta_campaign_insights(meta_campaign_id, insight_date);
CREATE INDEX IF NOT EXISTS idx_meta_leads_campaign_id ON meta_leads(meta_campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_leads_status ON meta_leads(status);
CREATE INDEX IF NOT EXISTS idx_meta_leads_created_at ON meta_leads(lead_created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_action_logs_customer_id ON campaign_action_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_campaign_action_logs_performed_at ON campaign_action_logs(performed_at);

-- Add updated_at trigger for meta_connections
CREATE OR REPLACE FUNCTION update_meta_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meta_connections_updated_at
    BEFORE UPDATE ON meta_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_meta_connections_updated_at();

-- Add updated_at trigger for meta_campaigns
CREATE OR REPLACE FUNCTION update_meta_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meta_campaigns_updated_at
    BEFORE UPDATE ON meta_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_meta_campaigns_updated_at();

-- Add updated_at trigger for meta_leads
CREATE OR REPLACE FUNCTION update_meta_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meta_leads_updated_at
    BEFORE UPDATE ON meta_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_meta_leads_updated_at();