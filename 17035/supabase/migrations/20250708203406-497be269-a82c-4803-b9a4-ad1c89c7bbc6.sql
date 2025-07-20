-- Create profile for the missing admin user
INSERT INTO public.profiles (id, username, full_name, role)
VALUES (
  '95eca5fe-5d18-4a94-ab17-b74460e2258c',
  'amanharrdy2345@gmail.com',
  'Aman Poddar',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin';