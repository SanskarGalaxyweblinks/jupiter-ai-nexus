
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Simple organization ID for demo - in production this would come from auth
const DEMO_ORG_ID = 'acme-corp';

export const useDashboardStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard', 'stats', user?.id],
    queryFn: async () => {
      console.log('Fetching dashboard stats for user:', user?.email);
      
      if (!user) {
        console.log('No user found, returning mock data');
        return getMockDashboardData();
      }

      try {
        // First try to get user's organization
        const { data: userProfile } = await supabase
          .from('users')
          .select(`
            *,
            organization_id,
            organizations!inner(*)
          `)
          .eq('id', user.id)
          .maybeSingle();

        console.log('User profile data:', userProfile);

        if (!userProfile?.organization_id) {
          console.log('No organization found for user, using demo org');
          return await getDemoOrgStats();
        }

        // Get today's usage summary for the user's organization
        const today = new Date().toISOString().split('T')[0];
        
        const { data: todayUsage } = await supabase
          .from('daily_usage_summary')
          .select(`
            total_requests,
            total_cost,
            avg_response_time_ms,
            success_rate,
            ai_models!inner(name, provider)
          `)
          .eq('organization_id', userProfile.organization_id)
          .eq('usage_date', today);

        console.log('Today usage data:', todayUsage);

        // Get current month billing
        const currentDate = new Date();
        const { data: monthlyBilling } = await supabase
          .from('monthly_usage_summary')
          .select('total_cost')
          .eq('organization_id', userProfile.organization_id)
          .eq('year', currentDate.getFullYear())
          .eq('month', currentDate.getMonth() + 1)
          .maybeSingle();

        console.log('Monthly billing data:', monthlyBilling);

        // Get recent API calls for the organization
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
          .eq('organization_id', userProfile.organization_id)
          .order('created_at', { ascending: false })
          .limit(5);

        console.log('Recent calls data:', recentCalls);

        // Calculate aggregated stats
        const totalRequests = todayUsage?.reduce((sum, item) => sum + (item.total_requests || 0), 0) || 0;
        const totalCost = todayUsage?.reduce((sum, item) => sum + (item.total_cost || 0), 0) || 0;
        const avgResponseTime = todayUsage?.length ? 
          todayUsage.reduce((sum, item) => sum + (item.avg_response_time_ms || 0), 0) / todayUsage.length : 0;
        const avgSuccessRate = todayUsage?.length ?
          todayUsage.reduce((sum, item) => sum + (item.success_rate || 0), 0) / todayUsage.length : 0;

        const stats = {
          totalRequests,
          totalCost,
          avgResponseTime: Math.round(avgResponseTime),
          successRate: Math.round(avgSuccessRate * 100),
          monthlyBilling: monthlyBilling?.total_cost || 0,
          recentCalls: recentCalls || [],
          todayUsage: todayUsage || []
        };

        console.log('Final dashboard stats:', stats);
        return stats;

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return getMockDashboardData();
      }
    },
    enabled: !!user,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
    gcTime: 300000 // Keep in cache for 5 minutes
  });
};

const getDemoOrgStats = async () => {
  try {
    // Get organization by demo slug
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', DEMO_ORG_ID)
      .maybeSingle();

    if (!org) {
      console.log('Demo org not found, returning mock data');
      return getMockDashboardData();
    }

    const today = new Date().toISOString().split('T')[0];
    
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

    const { data: monthlyBilling } = await supabase
      .from('monthly_usage_summary')
      .select('total_cost')
      .eq('organization_id', org.id)
      .eq('year', new Date().getFullYear())
      .eq('month', new Date().getMonth() + 1)
      .maybeSingle();

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
  } catch (error) {
    console.error('Error fetching demo org stats:', error);
    return getMockDashboardData();
  }
};

const getMockDashboardData = () => {
  console.log('Returning mock dashboard data');
  return {
    totalRequests: 8542,
    totalCost: 127.45,
    avgResponseTime: 245,
    successRate: 98,
    monthlyBilling: 387.50,
    recentCalls: [],
    todayUsage: []
  };
};

export const useBillingInfo = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['billing', user?.id],
    queryFn: async () => {
      console.log('Fetching billing info for user:', user?.email);
      
      if (!user) {
        console.log('No user found, returning empty billing data');
        return getEmptyBillingData();
      }

      try {
        // Get user's organization
        const { data: userProfile } = await supabase
          .from('users')
          .select(`
            *,
            organization_id,
            organizations!inner(*)
          `)
          .eq('id', user.id)
          .maybeSingle();

        console.log('User profile for billing:', userProfile);

        if (!userProfile?.organization_id) {
          console.log('No organization found, using demo org for billing');
          return await getDemoBillingData();
        }

        // Current billing cycle
        const { data: currentCycle } = await supabase
          .from('billing_cycles')
          .select(`
            *,
            billing_line_items(*)
          `)
          .eq('organization_id', userProfile.organization_id)
          .eq('status', 'pending')
          .order('cycle_start', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        console.log('Current billing cycle:', currentCycle);

        // Invoice history
        const { data: invoiceHistory } = await supabase
          .from('billing_cycles')
          .select('*')
          .eq('organization_id', userProfile.organization_id)
          .neq('status', 'draft')
          .order('cycle_start', { ascending: false })
          .limit(12);
        
        console.log('Invoice history:', invoiceHistory);

        // Payment methods
        const { data: paymentMethods } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('organization_id', userProfile.organization_id)
          .eq('is_active', true);
        
        console.log('Payment methods:', paymentMethods);

        return {
          currentCycle,
          invoiceHistory: invoiceHistory || [],
          paymentMethods: paymentMethods || []
        };

      } catch (error) {
        console.error('Error fetching billing info:', error);
        return getEmptyBillingData();
      }
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
    gcTime: 30 * 60 * 1000 // Keep in cache for 30 minutes
  });
};

const getDemoBillingData = async () => {
  try {
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', DEMO_ORG_ID)
      .maybeSingle();

    if (!org) {
      return getEmptyBillingData();
    }

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
    
    const { data: invoiceHistory } = await supabase
      .from('billing_cycles')
      .select('*')
      .eq('organization_id', org.id)
      .neq('status', 'draft')
      .order('cycle_start', { ascending: false })
      .limit(12);
    
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
    console.error('Error fetching demo billing data:', error);
    return getEmptyBillingData();
  }
};

const getEmptyBillingData = () => {
  return {
    currentCycle: null,
    invoiceHistory: [],
    paymentMethods: []
  };
};

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      console.log('Fetching user profile for:', user?.email);
      
      if (!user) {
        console.log('No user found');
        return null;
      }

      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select(`
            *,
            organizations(*)
          `)
          .eq('id', user.id)
          .maybeSingle();

        console.log('User profile data:', userProfile);

        if (!userProfile) {
          console.log('User profile not found in database, creating...');
          // Try to create user profile if it doesn't exist
          const { data: newProfile, error } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
              email_verified: !!user.email_confirmed_at
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating user profile:', error);
            return null;
          }

          console.log('Created new user profile:', newProfile);
          return newProfile;
        }

        return userProfile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 30 * 60 * 1000 // Keep in cache for 30 minutes
  });
};
