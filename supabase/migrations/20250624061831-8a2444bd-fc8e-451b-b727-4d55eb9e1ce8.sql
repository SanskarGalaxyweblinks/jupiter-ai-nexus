
-- Insert some sample usage data for testing with correct UUID function
INSERT INTO api_usage_logs (organization_id, model_id, request_id, prompt_tokens, completion_tokens, input_cost, output_cost, response_time_ms, status)
SELECT 
  o.id,
  m.id,
  'req_' || gen_random_uuid(),
  (random() * 1000)::integer,
  (random() * 500)::integer,
  (random() * 0.01)::decimal(10,8),
  (random() * 0.02)::decimal(10,8),
  (random() * 1000 + 100)::integer,
  'success'
FROM organizations o
CROSS JOIN ai_models m
WHERE o.slug IN ('acme-corp', 'startup-inc')
AND m.provider IN ('openai', 'anthropic')
LIMIT 20;
