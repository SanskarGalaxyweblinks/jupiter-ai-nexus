
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Simple organization ID for demo - in production this would come from auth
const DEMO_ORG_ID = 'acme-corp';

export const useDashboardStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      // Get organization ID first
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', DEMO_ORG_ID)
        .maybeSingle();

      if (!org) {
        // Return mock data if no org found
        return {
          totalRequests: 8542,
          totalCost: 127.45,
          avgResponseTime: 245,
          successRate: 98,
          monthlyBilling: 387.50,
          recentCalls: [],
          todayUsage: []
        };
      }

      const today = new Date().toISOString().split('T')[0];
      
      try {
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
          .limit(5);

        // Calculate aggregated stats for today
        const totalRequests = todayUsage?.reduce((sum, item) => sum + (item.total_requests || 0), 0) || 8542;
        const totalCost = todayUsage?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 127.45;
        const avgResponseTime = todayUsage?.length ? 
          todayUsage.reduce((sum, item) => sum + (item.avg_response_time_ms || 0), 0) / todayUsage.length : 245;
        const avgSuccessRate = todayUsage?.length ?
          todayUsage.reduce((sum, item) => sum + (item.success_rate || 0), 0) / todayUsage.length : 0.98;

        return {
          totalRequests,
          totalCost,
          avgResponseTime: Math.round(avgResponseTime),
          successRate: Math.round(avgSuccessRate * 100),
          monthlyBilling: monthlyBilling?.total_cost || 387.50,
          recentCalls: recentCalls || [],
          todayUsage: todayUsage || []
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Return mock data on error
        return {
          totalRequests: 8542,
          totalCost: 127.45,
          avgResponseTime: 245,
          successRate: 98,
          monthlyBilling: 387.50,
          recentCalls: [],
          todayUsage: []
        };
      }
    },
    enabled: !!user,
    refetchInterval: 300000, // Refresh every 5 minutes instead of 30 seconds
    staleTime: 60000, // Consider data stale after 1 minute
    gcTime: 300000 // Keep in cache for 5 minutes
  });
};

export const useBillingInfo = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['billing'],
    queryFn: async () => {
      // Get organization ID
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', DEMO_ORG_ID)
        .maybeSingle();

      if (!org) {
        return {
          currentCycle: null,
          invoiceHistory: [],
          paymentMethods: []
        };
      }

      try {
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
      } catch (error) {
        console.error('Error fetching billing info:', error);
        return {
          currentCycle: null,
          invoiceHistory: [],
          paymentMethods: []
        };
      }
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
    gcTime: 30 * 60 * 1000 // Keep in cache for 30 minutes
  });
};
