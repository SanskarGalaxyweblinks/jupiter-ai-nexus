
-- Drop all existing tables and their dependencies
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS alert_notifications CASCADE;
DROP TABLE IF EXISTS usage_alerts CASCADE;
DROP TABLE IF EXISTS rate_limit_tracking CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS billing_line_items CASCADE;
DROP TABLE IF EXISTS billing_cycles CASCADE;
DROP TABLE IF EXISTS monthly_usage_summary CASCADE;
DROP TABLE IF EXISTS hourly_usage_summary CASCADE;
DROP TABLE IF EXISTS organization_models CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- Drop existing tables that we'll recreate with simplified structure
DROP TABLE IF EXISTS daily_usage_summary CASCADE;
DROP TABLE IF EXISTS api_usage_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS ai_models CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS update_hourly_summary() CASCADE;

-- Create simplified organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'starter',
  monthly_request_limit INTEGER DEFAULT 10000,
  monthly_token_limit INTEGER DEFAULT 1000000,
  monthly_cost_limit DECIMAL(10,2) DEFAULT 100.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create simplified users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create simplified ai_models table
CREATE TABLE ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  model_identifier VARCHAR(100) NOT NULL,
  input_cost_per_1k_tokens DECIMAL(10,6) DEFAULT 0,
  output_cost_per_1k_tokens DECIMAL(10,6) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create simplified api_usage_logs table
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,8) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'success',
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create simplified daily_usage_summary table
CREATE TABLE daily_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  usage_date DATE,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  success_rate DECIMAL(5,4) DEFAULT 1.0000,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, model_id, usage_date)
);

-- Create monthly_billing_summary table
CREATE TABLE monthly_billing_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  year INTEGER,
  month INTEGER,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, year, month)
);

-- Create indexes for performance
CREATE INDEX idx_api_usage_logs_org_date ON api_usage_logs(organization_id, created_at DESC);
CREATE INDEX idx_daily_summary_org_date ON daily_usage_summary(organization_id, usage_date DESC);
CREATE INDEX idx_monthly_billing_org_date ON monthly_billing_summary(organization_id, year, month);

-- Insert sample organizations
INSERT INTO organizations (name, slug, subscription_tier, monthly_request_limit, monthly_token_limit, monthly_cost_limit) VALUES
('Acme Corporation', 'acme-corp', 'professional', 50000, 5000000, 500.00),
('Startup Inc', 'startup-inc', 'starter', 10000, 1000000, 100.00);

-- Insert sample AI models
INSERT INTO ai_models (name, provider, model_identifier, input_cost_per_1k_tokens, output_cost_per_1k_tokens) VALUES
('GPT-4 Turbo', 'openai', 'gpt-4-turbo-preview', 0.01, 0.03),
('Claude-3 Sonnet', 'anthropic', 'claude-3-sonnet-20240229', 0.003, 0.015),
('Gemini Pro', 'google', 'gemini-pro', 0.0005, 0.0015);

-- Insert sample users
INSERT INTO users (email, full_name, role, organization_id) VALUES
('admin@acme.com', 'John Admin', 'admin', (SELECT id FROM organizations WHERE slug = 'acme-corp')),
('user@acme.com', 'Jane User', 'user', (SELECT id FROM organizations WHERE slug = 'acme-corp'));

-- Enable RLS on core tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_billing_summary ENABLE ROW LEVEL SECURITY;

-- Enable realtime for key tables
ALTER TABLE api_usage_logs REPLICA IDENTITY FULL;
ALTER TABLE daily_usage_summary REPLICA IDENTITY FULL;
