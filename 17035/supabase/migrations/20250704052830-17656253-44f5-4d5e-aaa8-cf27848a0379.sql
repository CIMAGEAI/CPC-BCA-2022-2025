

-- Create polls table
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  end_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poll options table
CREATE TABLE public.poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poll votes table to track user votes
CREATE TABLE public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(poll_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls (everyone can view active polls, only admins can manage)
CREATE POLICY "Everyone can view active polls" 
  ON public.polls 
  FOR SELECT 
  USING (status = 'active' OR status = 'ended');

CREATE POLICY "Admins can manage polls" 
  ON public.polls 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- RLS Policies for poll options
CREATE POLICY "Everyone can view poll options" 
  ON public.poll_options 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage poll options" 
  ON public.poll_options 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- RLS Policies for poll votes
CREATE POLICY "Users can view all votes" 
  ON public.poll_votes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own votes" 
  ON public.poll_votes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for all tables
ALTER TABLE public.polls REPLICA IDENTITY FULL;
ALTER TABLE public.poll_options REPLICA IDENTITY FULL;
ALTER TABLE public.poll_votes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_options;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_votes;

-- Function to update poll vote counts
CREATE OR REPLACE FUNCTION update_poll_option_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.poll_options 
  SET votes = (
    SELECT COUNT(*) 
    FROM public.poll_votes 
    WHERE option_id = NEW.option_id
  )
  WHERE id = NEW.option_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vote counts when new vote is cast
CREATE TRIGGER update_vote_counts_trigger
  AFTER INSERT ON public.poll_votes
  FOR EACH ROW EXECUTE FUNCTION update_poll_option_votes();

-- Update the existing profiles table to set your email as admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'amanharrdy2345@gmail.com'
);

