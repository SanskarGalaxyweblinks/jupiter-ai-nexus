
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const DEMO_ORG_ID = 'acme-corp';

const getDemoOrgId = async () => {
  try {
    const { data: org } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', DEMO_ORG_ID)
      .maybeSingle();
    return org?.id;
  } catch (error) {
    console.error('Error fetching demo org:', error);
    return null;
  }
};

const getMockDashboardData = () => ({
  totalRequests: 8542,
  totalCost: 127.45,
  avgResponseTime: 245,
  successRate: 98,
  recentCalls: [],
  todayUsage: []
});

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
        const { data: userProfile } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', user.id)
          .maybeSingle();

        const orgId = userProfile?.organization_id || await getDemoOrgId();
        if (!orgId) return getMockDashboardData();

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
          .eq('organization_id', orgId)
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
          .eq('organization_id', orgId)
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
        console.error('Error fetching dashboard stats:', error);
        return getMockDashboardData();
      }
    },
    enabled: !!user,
    refetchInterval: 300000,
    staleTime: 60000,
    gcTime: 300000
  });
};

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select(`*, organizations(*)`)
          .eq('id', user.id)
          .maybeSingle();

        if (!userProfile) {
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
          return newProfile;
        }

        return userProfile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });
};

export const useUsageHistory = (days = 7) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['usage-history', user?.id, days],
    queryFn: async () => {
      if (!user) return [];

      try {
        const { data: userProfile } = await supabase
          .from('users')
          .select('organization_id')
          .eq('id', user.id)
          .maybeSingle();

        const orgId = userProfile?.organization_id || await getDemoOrgId();
        if (!orgId) return [];

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
          .eq('organization_id', orgId)
          .gte('usage_date', startDate.toISOString().split('T')[0])
          .order('usage_date', { ascending: true });

        return usageHistory || [];
      } catch (error) {
        console.error('Error fetching usage history:', error);
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });
};

export const useAvailableModels = () => {
  return useQuery({
    queryKey: ['ai-models'],
    queryFn: async () => {
      try {
        const { data: models } = await supabase
          .from('ai_models')
          .select('*')
          .eq('is_active', true)
          .order('name');

        return models || [];
      } catch (error) {
        console.error('Error fetching AI models:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });
};
