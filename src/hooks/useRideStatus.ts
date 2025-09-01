import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RideStatusData {
  id: string;
  status: 'pending' | 'en-route' | 'completed';
  name: string;
  contact: string;
  vehicle_type: string;
  location_address: string;
  issue_description: string;
  created_at: string;
  updated_at: string;
}

export const useRideStatus = (rideId?: string) => {
  const [rideStatus, setRideStatus] = useState<RideStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch initial ride data
  const fetchRideStatus = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setRideStatus({
        ...data,
        status: data.status as 'pending' | 'en-route' | 'completed'
      });
    } catch (error) {
      console.error('Error fetching ride status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ride status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!rideId) return;

    // Fetch initial data
    fetchRideStatus(rideId);

    // Set up real-time subscription
    const channel = supabase
      .channel('ride-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${rideId}`,
        },
        (payload) => {
          console.log('Ride status updated:', payload);
          setRideStatus({
            ...payload.new,
            status: payload.new.status as 'pending' | 'en-route' | 'completed'
          } as RideStatusData);
          
          // Show notification for status changes
          const newStatus = payload.new.status;
          let message = '';
          
          switch (newStatus) {
            case 'en-route':
              message = 'Your driver is on the way!';
              break;
            case 'completed':
              message = 'Your ride has been completed. Thank you!';
              break;
            default:
              message = `Status updated to ${newStatus}`;
          }
          
          toast({
            title: "Ride Status Updated",
            description: message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, toast]);

  return {
    rideStatus,
    loading,
    refetch: rideId ? () => fetchRideStatus(rideId) : undefined,
  };
};