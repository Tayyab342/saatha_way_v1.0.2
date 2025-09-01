-- Fix critical security issue: Restrict driver applications data access to admins only
-- Remove the existing policy that allows anyone to view driver applications
DROP POLICY IF EXISTS "Anyone can submit driver application" ON public.driver_applications;

-- Add secure policies for driver applications
CREATE POLICY "Only admins can view driver applications" 
ON public.driver_applications 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Anyone can submit driver application" 
ON public.driver_applications 
FOR INSERT 
WITH CHECK (true);

-- Ensure the admin function is secure and immutable
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@saathaway.com';
END;
$function$;