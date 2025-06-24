
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up real-time updates...');

    // Real-time usage updates
    const usageChannel = supabase
      .channel('usage-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'api_usage_logs'
        },
        (payload) => {
          console.log('New API usage:', payload);
          // Invalidate dashboard stats to trigger refresh
          queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
          queryClient.invalidateQueries({ queryKey: ['usage-history'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'daily_usage_summary'
        },
        (payload) => {
          console.log('Daily summary updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
          queryClient.invalidateQueries({ queryKey: ['usage-history'] });
        }
      )
      .subscribe();

    console.log('Real-time subscriptions created');

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(usageChannel);
    };
  }, [queryClient, toast]);
};
