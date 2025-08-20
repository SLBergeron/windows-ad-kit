-- Add business_intel column to campaigns table
-- This stores the business intelligence data collected during onboarding

ALTER TABLE campaigns ADD COLUMN business_intel JSONB DEFAULT '{}';

-- Add index for business_intel queries
CREATE INDEX idx_campaigns_business_intel ON campaigns USING GIN (business_intel);

-- Update the updated_at timestamp when business_intel is modified
-- (The existing trigger will handle this automatically)