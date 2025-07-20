-- Update RLS policies to restrict admin access to only their own polls

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can manage polls" ON public.polls;
DROP POLICY IF EXISTS "Admins can manage poll options" ON public.polls;

-- Create new restrictive admin policies for polls
CREATE POLICY "Admins can manage their own polls" 
ON public.polls 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) 
  AND created_by = auth.uid()
);

-- Create new restrictive admin policies for poll options
CREATE POLICY "Admins can manage their own poll options" 
ON public.poll_options 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) 
  AND EXISTS (
    SELECT 1 FROM polls 
    WHERE polls.id = poll_options.poll_id 
    AND polls.created_by = auth.uid()
  )
);