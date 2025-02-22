CREATE TABLE public.shifts (
  id BIGSERIAL PRIMARY KEY, 
  user_id INTEGER REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  from_time TIMESTAMP WITH TIME ZONE NOT NULL,
  to_time TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE public.shifts 
ALTER COLUMN created_at SET DEFAULT (now() AT TIME ZONE 'Asia/Tokyo'),
ALTER COLUMN from_time SET DEFAULT (now() AT TIME ZONE 'Asia/Tokyo'),
ALTER COLUMN to_time SET DEFAULT (now() AT TIME ZONE 'Asia/Tokyo');
