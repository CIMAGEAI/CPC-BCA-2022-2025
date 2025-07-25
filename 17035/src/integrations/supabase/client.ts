// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://olcqabusqbdkjgqbrqdt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sY3FhYnVzcWJka2pncWJycWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Njc1OTAsImV4cCI6MjA2NzE0MzU5MH0.OPFgvkhDQoKr4B_OoGJprJGvDjwbDPuVB14awAsQhKk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});