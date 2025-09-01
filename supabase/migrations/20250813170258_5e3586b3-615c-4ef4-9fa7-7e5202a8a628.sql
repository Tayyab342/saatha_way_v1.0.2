-- Add subscription fields to driver_applications table
ALTER TABLE public.driver_applications 
ADD COLUMN subscription_duration TEXT,
ADD COLUMN subscription_price INTEGER,
ADD COLUMN subscription_start_date TIMESTAMPTZ,
ADD COLUMN subscription_end_date TIMESTAMPTZ,
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN previous_experience TEXT,
ADD COLUMN availability TEXT;