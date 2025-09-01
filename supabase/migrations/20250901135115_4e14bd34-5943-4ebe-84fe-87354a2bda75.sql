-- Fix driver applications status constraint to include all needed status values
-- Drop the existing constraint
ALTER TABLE public.driver_applications DROP CONSTRAINT IF EXISTS driver_applications_status_check;

-- Add new constraint with all required status values including the ones used in admin panel
ALTER TABLE public.driver_applications 
ADD CONSTRAINT driver_applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'suspended', 'under_review'));