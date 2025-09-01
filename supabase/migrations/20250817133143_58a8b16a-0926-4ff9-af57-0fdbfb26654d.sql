
-- Add UPDATE and DELETE permissions for admins on driver_applications table
CREATE POLICY "Admins can update driver applications" 
ON public.driver_applications 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete driver applications" 
ON public.driver_applications 
FOR DELETE 
USING (is_admin());
