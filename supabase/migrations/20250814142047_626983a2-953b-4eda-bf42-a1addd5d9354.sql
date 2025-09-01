-- Enable real-time functionality for rides table
ALTER TABLE public.rides REPLICA IDENTITY FULL;

-- Add the rides table to the realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.rides;