
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Sample organization ID for demo - in production this would come from auth
const DEMO_ORG_ID = 'acme-corp';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      // Get organization ID first
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', DEMO_ORG_ID)
        .single();

      if (!org) throw new Error('Organization not found');

      const today = new Date().toISOString().split('T')[0];
      
      // Get today's usage summary
      const { data: todayUsage } = await supabase
        .from('daily_usage_summary')
        .select(`
          total_requests,
          total_cost,
          avg_response_time_ms,
          success_rate,
          ai_models!inner(name, provider)
        `)
        .eq('organization_id', org.id)
        .eq('usage_date', today);

      // Get current month billing
      const currentDate = new Date();
      const { data: monthlyBilling } = await supabase
        .from('monthly_usage_summary')
        .select('total_cost')
        .eq('organization_id', org.id)
        .eq('year', currentDate.getFullYear())
        .eq('month', currentDate.getMonth() + 1)
        .maybeSingle();

      // Get recent API calls
      const { data: recentCalls } = await supabase
        .from('api_usage_logs')
        .select(`
          request_id,
          total_tokens,
          total_cost,
          response_time_ms,
          status,
          created_at,
          ai_models!inner(name),
          users(full_name)
        `)
        .eq('organization_id', org.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate aggregated stats for today
      const totalRequests = todayUsage?.reduce((sum, item) => sum + (item.total_requests || 0), 0) || 0;
      const totalCost = todayUsage?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0;
      const avgResponseTime = todayUsage?.length ? 
        todayUsage.reduce((sum, item) => sum + (item.avg_response_time_ms || 0), 0) / todayUsage.length : 0;
      const avgSuccessRate = todayUsage?.length ?
        todayUsage.reduce((sum, item) => sum + (item.success_rate || 0), 0) / todayUsage.length : 0;

      return {
        totalRequests,
        totalCost,
        avgResponseTime: Math.round(avgResponseTime),
        successRate: Math.round(avgSuccessRate * 100),
        monthlyBilling: monthlyBilling?.total_cost || 0,
        recentCalls: recentCalls || [],
        todayUsage: todayUsage || []
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};

export const useUsageAnalytics = (dateRange: string = '7d') => {
  return useQuery({
    queryKey: ['analytics', 'usage', dateRange],
    queryFn: async () => {
      // Get organization ID
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', DEMO_ORG_ID)
        .single();

      if (!org) throw new Error('Organization not found');

      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data } = await supabase
        .from('daily_usage_summary')
        .select(`
          usage_date,
          total_requests,
          total_tokens,
          total_cost,
          avg_response_time_ms,
          success_rate,
          ai_models!inner(name, provider)
        `)
        .eq('organization_id', org.id)
        .gte('usage_date', startDate)
        .order('usage_date', { ascending: true });
      
      return data || [];
    }
  });
};

export const useBillingInfo = () => {
  return useQuery({
    queryKey: ['billing'],
    queryFn: async () => {
      // Get organization ID
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', DEMO_ORG_ID)
        .single();

      if (!org) throw new Error('Organization not found');

      // Current billing cycle
      const { data: currentCycle } = await supabase
        .from('billing_cycles')
        .select(`
          *,
          billing_line_items(*)
        `)
        .eq('organization_id', org.id)
        .eq('status', 'pending')
        .order('cycle_start', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      // Invoice history
      const { data: invoiceHistory } = await supabase
        .from('billing_cycles')
        .select('*')
        .eq('organization_id', org.id)
        .neq('status', 'draft')
        .order('cycle_start', { ascending: false })
        .limit(12);
      
      // Payment methods
      const { data: paymentMethods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('organization_id', org.id)
        .eq('is_active', true);
      
      return {
        currentCycle,
        invoiceHistory: invoiceHistory || [],
        paymentMethods: paymentMethods || []
      };
    }
  });
};

export const useAPIUsage = () => {
  return useQuery({
    queryKey: ['api', 'usage'],
    queryFn: async () => {
      // Get organization ID
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', DEMO_ORG_ID)
        .single();

      if (!org) throw new Error('Organization not found');

      // Get recent API usage logs
      const { data: apiLogs } = await supabase
        .from('api_usage_logs')
        .select(`
          *,
          ai_models!inner(name, provider),
          users(full_name)
        `)
        .eq('organization_id', org.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get API keys
      const { data: apiKeys } = await supabase
        .from('api_keys')
        .select('*')
        .eq('organization_id', org.id)
        .eq('is_active', true);

      return {
        apiLogs: apiLogs || [],
        apiKeys: apiKeys || []
      };
    }
  });
};
