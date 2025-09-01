-- First, let's drop the existing problematic policy and create a security definer function
-- to avoid direct access to auth.users table

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@saathaway.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new policy using the security definer function
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Also update the rides policies to use the same function
DROP POLICY IF EXISTS "Admins can view all rides" ON public.rides;
DROP POLICY IF EXISTS "Admin can update all rides" ON public.rides;
DROP POLICY IF EXISTS "Admins can update all rides" ON public.rides;

CREATE POLICY "Admins can view all rides"
ON public.rides
FOR SELECT
TO authenticated
USING (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can update all rides"
ON public.rides
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete all rides"
ON public.rides
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Update driver applications policy
DROP POLICY IF EXISTS "Admins can view all driver applications" ON public.driver_applications;

CREATE POLICY "Admins can view all driver applications"
ON public.driver_applications
FOR SELECT
TO authenticated
USING (public.is_admin());