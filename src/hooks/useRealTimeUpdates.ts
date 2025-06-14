
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
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
          queryClient.invalidateQueries({ queryKey: ['analytics', 'usage'] });
          queryClient.invalidateQueries({ queryKey: ['api', 'usage'] });
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
          queryClient.invalidateQueries({ queryKey: ['analytics', 'usage'] });
        }
      )
      .subscribe();

    // Real-time notifications
    const notificationChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('New notification:', payload);
          const notification = payload.new as any;
          
          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.priority === 'urgent' ? 'destructive' : 'default'
          });
          
          // Update notification queries
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usageChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, [queryClient, toast]);
};
