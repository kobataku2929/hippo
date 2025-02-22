CREATE TABLE public.profiles (
 id SERIAL PRIMARY KEY, 
  user_id UUID UNIQUE REFERENCES auth.users NOT NULL, 
  user_name TEXT,
  user_type TEXT,
  work_place TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);