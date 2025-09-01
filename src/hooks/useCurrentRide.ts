import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCurrentRide = () => {
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCurrentRide = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('rides')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['pending', 'en-route'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      setCurrentRideId(data?.id || null);
    } catch (error) {
      console.error('Error fetching current ride:', error);
      if (error.message !== 'User not authenticated') {
        toast({
          title: "No Active Ride",
          description: "You don't have any active rides to track",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentRide();
  }, []);

  return {
    currentRideId,
    loading,
    refetch: fetchCurrentRide,
  };
};