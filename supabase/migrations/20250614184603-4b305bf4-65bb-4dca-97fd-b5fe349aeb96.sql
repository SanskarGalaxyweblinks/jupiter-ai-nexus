
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (Multi-tenant core)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  subscription_tier VARCHAR(50) DEFAULT 'starter', -- 'starter', 'professional', 'enterprise'
  billing_email VARCHAR(255),
  monthly_budget DECIMAL(10,2) DEFAULT 0,
  api_key_prefix VARCHAR(20) DEFAULT 'jb_',
  logo_url TEXT,
  industry VARCHAR(100),
  company_size VARCHAR(50), -- 'startup', 'small', 'medium', 'large', 'enterprise'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users with role-based access
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- 'super_admin', 'org_admin', 'user', 'viewer'
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  avatar_url TEXT,
  job_title VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(20),
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Models catalog (Admin managed)
CREATE TABLE ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL, -- 'GPT-4 Turbo', 'Claude-3 Sonnet', 'Gemini Pro'
  provider VARCHAR(100) NOT NULL, -- 'openai', 'anthropic', 'google', 'meta'
  model_identifier VARCHAR(100) NOT NULL, -- 'gpt-4-turbo', 'claude-3-sonnet-20240229'
  version VARCHAR(50), -- 'v1.0', 'latest'
  input_cost_per_1k_tokens DECIMAL(10,6) DEFAULT 0,
  output_cost_per_1k_tokens DECIMAL(10,6) DEFAULT 0,
  max_tokens INTEGER DEFAULT 4096,
  context_window INTEGER DEFAULT 8192,
  description TEXT,
  capabilities JSONB DEFAULT '{}', -- {"vision": true, "function_calling": true, "streaming": true}
  performance_tier VARCHAR(50) DEFAULT 'standard', -- 'basic', 'standard', 'premium'
  is_active BOOLEAN DEFAULT true,
  release_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Organization model assignments (What models each org can use)
CREATE TABLE organization_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  rate_limit_per_minute INTEGER DEFAULT 60,
  rate_limit_per_hour INTEGER DEFAULT 1000,
  rate_limit_per_day INTEGER DEFAULT 10000,
  monthly_quota INTEGER,
  priority_access BOOLEAN DEFAULT false,
  custom_pricing JSONB, -- Override default pricing
  is_enabled BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  notes TEXT,
  UNIQUE(organization_id, model_id)
);

-- Detailed API usage logs (Core tracking)
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  request_id VARCHAR(255) UNIQUE NOT NULL,
  endpoint VARCHAR(255),
  method VARCHAR(10) DEFAULT 'POST',
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (prompt_tokens + completion_tokens) STORED,
  input_cost DECIMAL(10,8) DEFAULT 0,
  output_cost DECIMAL(10,8) DEFAULT 0,
  total_cost DECIMAL(10,8) GENERATED ALWAYS AS (input_cost + output_cost) STORED,
  response_time_ms INTEGER,
  status_code INTEGER DEFAULT 200,
  status VARCHAR(50) DEFAULT 'success', -- 'success', 'error', 'rate_limited', 'quota_exceeded'
  error_type VARCHAR(100),
  error_message TEXT,
  user_agent TEXT,
  ip_address INET,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  model_version VARCHAR(50),
  temperature DECIMAL(3,2),
  max_tokens_requested INTEGER,
  stream_used BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}', -- Additional context like session_id, feature_flags, etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pre-aggregated hourly summaries (Performance optimization)
CREATE TABLE hourly_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  hour_timestamp TIMESTAMP, -- Rounded to the hour
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,4) DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  max_response_time_ms INTEGER DEFAULT 0,
  min_response_time_ms INTEGER DEFAULT 0,
  peak_requests_per_minute INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, model_id, hour_timestamp)
);

-- Daily usage summaries (Dashboard data)
CREATE TABLE daily_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  usage_date DATE,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  success_rate DECIMAL(5,4) DEFAULT 1.0000, -- 0.0000 to 1.0000
  peak_hour INTEGER, -- Hour with highest usage (0-23)
  peak_requests INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  error_breakdown JSONB DEFAULT '{}', -- {"rate_limit": 10, "server_error": 2}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, model_id, usage_date)
);

-- Monthly summaries (Billing data)
CREATE TABLE monthly_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  year INTEGER,
  month INTEGER,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  average_daily_requests INTEGER DEFAULT 0,
  peak_daily_requests INTEGER DEFAULT 0,
  models_used JSONB DEFAULT '{}', -- {"gpt-4": {"requests": 100, "cost": 50.00, "tokens": 10000}}
  cost_breakdown JSONB DEFAULT '{}', -- {"input_tokens": 25.50, "output_tokens": 24.50}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, year, month)
);

-- Billing cycles and invoices
CREATE TABLE billing_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  cycle_start DATE,
  cycle_end DATE,
  usage_cost DECIMAL(10,2) DEFAULT 0,
  subscription_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending', 'sent', 'paid', 'overdue', 'cancelled'
  invoice_number VARCHAR(100) UNIQUE,
  invoice_url TEXT,
  due_date DATE,
  payment_terms VARCHAR(50) DEFAULT 'net_30', -- 'immediate', 'net_15', 'net_30'
  sent_at TIMESTAMP,
  paid_at TIMESTAMP,
  payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'check'
  payment_reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Detailed billing line items
CREATE TABLE billing_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_cycle_id UUID REFERENCES billing_cycles(id) ON DELETE CASCADE,
  model_id UUID REFERENCES ai_models(id),
  item_type VARCHAR(50), -- 'usage', 'subscription', 'overage', 'credit', 'discount'
  description TEXT,
  quantity INTEGER DEFAULT 0, -- tokens, requests, etc.
  unit_type VARCHAR(50), -- 'tokens', 'requests', 'hours'
  unit_price DECIMAL(10,8),
  total_amount DECIMAL(10,2),
  period_start DATE,
  period_end DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payment methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50), -- 'card', 'bank_account', 'paypal'
  provider VARCHAR(50), -- 'stripe', 'paypal', 'bank'
  provider_payment_method_id VARCHAR(255),
  last_four VARCHAR(4),
  brand VARCHAR(50), -- 'visa', 'mastercard', 'american_express'
  expiry_month INTEGER,
  expiry_year INTEGER,
  cardholder_name VARCHAR(255),
  billing_address JSONB, -- {"street": "", "city": "", "state": "", "zip": "", "country": ""}
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment history
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_cycle_id UUID REFERENCES billing_cycles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50), -- 'pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'
  provider_transaction_id VARCHAR(255),
  failure_reason TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rate limiting tracking (Real-time)
CREATE TABLE rate_limit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
  time_window TIMESTAMP, -- Rounded to minute/hour/day
  window_type VARCHAR(20), -- 'minute', 'hour', 'day', 'month'
  request_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  last_request_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, model_id, time_window, window_type)
);

-- Usage alerts and notifications
CREATE TABLE usage_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  alert_type VARCHAR(50), -- 'cost_threshold', 'usage_threshold', 'quota_warning', 'rate_limit'
  threshold_value DECIMAL(10,2),
  threshold_type VARCHAR(50), -- 'percentage', 'absolute', 'daily_limit'
  current_value DECIMAL(10,2),
  notification_channels JSONB, -- {"email": ["admin@company.com"], "slack": ["webhook_url"]}
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alert history
CREATE TABLE alert_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES usage_alerts(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  triggered_value DECIMAL(10,2),
  message TEXT,
  channels_sent JSONB, -- {"email": "sent", "slack": "failed"}
  sent_at TIMESTAMP DEFAULT NOW()
);

-- API keys management
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255),
  key_prefix VARCHAR(20), -- 'jb_prod_', 'jb_test_'
  key_hash VARCHAR(255), -- Hashed version of the full key
  environment VARCHAR(50) DEFAULT 'production', -- 'production', 'development', 'staging'
  permissions JSONB DEFAULT '{"read": true, "write": true}',
  rate_limit_override JSONB, -- Override organization limits
  allowed_models JSONB, -- Restrict to specific models
  ip_whitelist JSONB, -- Array of allowed IP addresses
  last_used TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100), -- 'user_login', 'api_key_created', 'model_assigned', 'billing_updated'
  resource_type VARCHAR(50), -- 'user', 'organization', 'api_key', 'model', 'billing'
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  success BOOLEAN DEFAULT true,
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- System notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50), -- 'usage_alert', 'billing_reminder', 'system_update', 'security_alert'
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  title VARCHAR(255),
  message TEXT,
  action_url TEXT,
  action_text VARCHAR(100),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  expires_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- System settings and configuration
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE,
  value JSONB,
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Can be read by frontend
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_api_usage_logs_org_model_date ON api_usage_logs(organization_id, model_id, created_at DESC);
CREATE INDEX idx_api_usage_logs_created_at ON api_usage_logs(created_at DESC);
CREATE INDEX idx_daily_summary_org_date ON daily_usage_summary(organization_id, usage_date DESC);
CREATE INDEX idx_hourly_summary_org_timestamp ON hourly_usage_summary(organization_id, hour_timestamp DESC);
CREATE INDEX idx_billing_cycles_org_status ON billing_cycles(organization_id, status);
CREATE INDEX idx_rate_limit_tracking_lookup ON rate_limit_tracking(organization_id, model_id, time_window, window_type);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Insert initial AI models
INSERT INTO ai_models (name, provider, model_identifier, input_cost_per_1k_tokens, output_cost_per_1k_tokens, max_tokens, context_window, capabilities) VALUES
('GPT-4 Turbo', 'openai', 'gpt-4-turbo-preview', 0.01, 0.03, 4096, 128000, '{"vision": false, "function_calling": true, "streaming": true}'),
('GPT-4 Vision', 'openai', 'gpt-4-vision-preview', 0.01, 0.03, 4096, 128000, '{"vision": true, "function_calling": true, "streaming": true}'),
('Claude-3 Sonnet', 'anthropic', 'claude-3-sonnet-20240229', 0.003, 0.015, 4096, 200000, '{"vision": true, "function_calling": false, "streaming": true}'),
('Claude-3 Opus', 'anthropic', 'claude-3-opus-20240229', 0.015, 0.075, 4096, 200000, '{"vision": true, "function_calling": false, "streaming": true}'),
('Gemini Pro', 'google', 'gemini-pro', 0.0005, 0.0015, 2048, 32000, '{"vision": false, "function_calling": true, "streaming": true}'),
('Gemini Pro Vision', 'google', 'gemini-pro-vision', 0.0005, 0.0015, 2048, 32000, '{"vision": true, "function_calling": false, "streaming": true}');

-- Insert system settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('default_rate_limits', '{"minute": 60, "hour": 1000, "day": 10000}', 'Default rate limits for new organizations', false),
('supported_currencies', '["USD", "EUR", "GBP"]', 'Supported billing currencies', true),
('billing_cycle_days', '30', 'Default billing cycle length in days', false),
('free_tier_limits', '{"requests": 1000, "tokens": 100000, "cost": 10.00}', 'Free tier monthly limits', true);

-- Sample organization for testing
INSERT INTO organizations (name, slug, subscription_tier, billing_email, industry, company_size) VALUES
('Acme Corporation', 'acme-corp', 'professional', 'billing@acme.com', 'Technology', 'medium'),
('Startup Inc', 'startup-inc', 'starter', 'admin@startup.com', 'SaaS', 'startup'),
('Enterprise Ltd', 'enterprise-ltd', 'enterprise', 'finance@enterprise.com', 'Finance', 'large');

-- Sample users
INSERT INTO users (email, full_name, role, organization_id, job_title) VALUES
('admin@acme.com', 'John Admin', 'org_admin', (SELECT id FROM organizations WHERE slug = 'acme-corp'), 'CTO'),
('user@acme.com', 'Jane User', 'user', (SELECT id FROM organizations WHERE slug = 'acme-corp'), 'Developer'),
('super@jupiterbrains.com', 'Super Admin', 'super_admin', NULL, 'System Administrator');

-- Assign models to organizations
INSERT INTO organization_models (organization_id, model_id, rate_limit_per_hour, rate_limit_per_day, is_enabled)
SELECT 
  o.id as organization_id,
  m.id as model_id,
  CASE o.subscription_tier
    WHEN 'starter' THEN 100
    WHEN 'professional' THEN 1000
    WHEN 'enterprise' THEN 10000
  END as rate_limit_per_hour,
  CASE o.subscription_tier
    WHEN 'starter' THEN 1000
    WHEN 'professional' THEN 10000
    WHEN 'enterprise' THEN 100000
  END as rate_limit_per_day,
  true as is_enabled
FROM organizations o
CROSS JOIN ai_models m
WHERE o.subscription_tier != 'free';

-- Sample usage data for the last 30 days
INSERT INTO daily_usage_summary (organization_id, model_id, usage_date, total_requests, successful_requests, total_tokens, total_cost, avg_response_time_ms, success_rate)
SELECT 
  o.id,
  m.id,
  CURRENT_DATE - INTERVAL '1 day' * generate_series(1, 30),
  (random() * 1000)::integer,
  (random() * 950)::integer,
  (random() * 100000)::integer,
  (random() * 50)::decimal(10,2),
  (random() * 2000 + 200)::integer,
  (random() * 0.1 + 0.9)::decimal(5,4)
FROM organizations o
CROSS JOIN ai_models m
WHERE o.subscription_tier != 'free';

-- Function to update hourly summaries
CREATE OR REPLACE FUNCTION update_hourly_summary()
RETURNS TRIGGER AS $$
DECLARE
  hour_window TIMESTAMP;
BEGIN
  hour_window := DATE_TRUNC('hour', NEW.created_at);
  
  INSERT INTO hourly_usage_summary (
    organization_id, model_id, hour_timestamp,
    total_requests, successful_requests, failed_requests,
    total_tokens, total_cost, avg_response_time_ms
  )
  VALUES (
    NEW.organization_id, NEW.model_id, hour_window,
    1, 
    CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END,
    CASE WHEN NEW.status != 'success' THEN 1 ELSE 0 END,
    NEW.total_tokens, NEW.total_cost, NEW.response_time_ms
  )
  ON CONFLICT (organization_id, model_id, hour_timestamp)
  DO UPDATE SET
    total_requests = hourly_usage_summary.total_requests + 1,
    successful_requests = hourly_usage_summary.successful_requests + 
      CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END,
    failed_requests = hourly_usage_summary.failed_requests + 
      CASE WHEN NEW.status != 'success' THEN 1 ELSE 0 END,
    total_tokens = hourly_usage_summary.total_tokens + NEW.total_tokens,
    total_cost = hourly_usage_summary.total_cost + NEW.total_cost,
    avg_response_time_ms = (
      (hourly_usage_summary.avg_response_time_ms * hourly_usage_summary.total_requests + NEW.response_time_ms) /
      (hourly_usage_summary.total_requests + 1)
    ),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for hourly aggregation
CREATE TRIGGER trigger_update_hourly_summary
  AFTER INSERT ON api_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_hourly_summary();

-- Enable RLS on core tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Enable realtime for key tables
ALTER TABLE api_usage_logs REPLICA IDENTITY FULL;
ALTER TABLE daily_usage_summary REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
