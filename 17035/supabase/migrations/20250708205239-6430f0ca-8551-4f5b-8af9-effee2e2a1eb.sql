-- Fix RLS policies to ensure admins only see their own polls in admin dashboard

-- Drop the conflicting policies
DROP POLICY IF EXISTS "Everyone can view active polls" ON public.polls;
DROP POLICY IF EXISTS "Admins can manage their own polls" ON public.polls;

-- Create separate policies for different user types
-- Policy for regular users (non-admins) to view active polls
CREATE POLICY "Regular users can view active polls" 
ON public.polls 
FOR SELECT 
USING (
  (status = 'active' OR status = 'ended') 
  AND NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for admins to only see their own polls
CREATE POLICY "Admins can only see their own polls" 
ON public.polls 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) 
  AND created_by = auth.uid()
);

-- Policy for admins to manage (INSERT, UPDATE, DELETE) their own polls
CREATE POLICY "Admins can modify their own polls" 
ON public.polls 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) 
  AND created_by = auth.uid()
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) 
  AND created_by = auth.uid()
);