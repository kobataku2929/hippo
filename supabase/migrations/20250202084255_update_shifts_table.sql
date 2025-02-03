ALTER TABLE public.shifts 
ALTER COLUMN created_at SET DEFAULT (now() AT TIME ZONE 'Asia/Tokyo'),
ALTER COLUMN from_time SET DEFAULT (now() AT TIME ZONE 'Asia/Tokyo'),
ALTER COLUMN to_time SET DEFAULT (now() AT TIME ZONE 'Asia/Tokyo');
