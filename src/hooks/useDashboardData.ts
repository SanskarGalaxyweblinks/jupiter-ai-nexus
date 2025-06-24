
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
    recentCalls: [],
    todayUsage: []
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
              full_name: user.user_metadata?.full_name || ''
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

export const useAvailableModels = () => {
  return useQuery({
    queryKey: ['ai-models'],
    queryFn: async () => {
      console.log('Fetching available AI models');
      
      try {
        const { data: models } = await supabase
          .from('ai_models')
          .select('*')
          .eq('is_active', true)
          .order('name');

        console.log('Available models:', models);
        return models || [];
      } catch (error) {
        console.error('Error fetching AI models:', error);
        return [];
      }
    },
    staleTime: 30 * 60 * 1000, // Consider data stale after 30 minutes
    gcTime: 60 * 60 * 1000 // Keep in cache for 1 hour
  });
};

export const useUsageHistory = (days = 7) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['usage-history', user?.id, days],
    queryFn: async () => {
      console.log(`Fetching usage history for ${days} days`);
      
      if (!user) {
        return [];
      }

      try {
        // Get user's organization
        const { data: userProfile } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', user.id)
          .maybeSingle();

        if (!userProfile?.organization_id) {
          console.log('No organization found, using demo org');
          const { data: org } = await supabase
            .from('organizations')
            .select('id')
            .eq('slug', DEMO_ORG_ID)
            .maybeSingle();
          
          if (!org) return [];
          userProfile.organization_id = org.id;
        }

        // Get usage history for the last N days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: usageHistory } = await supabase
          .from('daily_usage_summary')
          .select(`
            usage_date,
            total_requests,
            total_cost,
            total_tokens,
            success_rate,
            ai_models!inner(name, provider)
          `)
          .eq('organization_id', userProfile.organization_id)
          .gte('usage_date', startDate.toISOString().split('T')[0])
          .order('usage_date', { ascending: true });

        console.log('Usage history:', usageHistory);
        return usageHistory || [];
      } catch (error) {
        console.error('Error fetching usage history:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 30 * 60 * 1000 // Keep in cache for 30 minutes
  });
};
