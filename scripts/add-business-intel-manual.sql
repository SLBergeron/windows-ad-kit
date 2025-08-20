-- Manual SQL to add business_intel column to campaigns table
-- Copy and paste this into Supabase SQL Editor

-- Add business_intel column to campaigns table
ALTER TABLE campaigns ADD COLUMN business_intel JSONB DEFAULT '{}';

-- Add index for business_intel queries
CREATE INDEX idx_campaigns_business_intel ON campaigns USING GIN (business_intel);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'campaigns' AND column_name = 'business_intel';