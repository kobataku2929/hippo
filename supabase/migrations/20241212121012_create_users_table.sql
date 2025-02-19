create table
profiles (
id uuid references auth.users not null primary key,
user_name text,
user_type text,
work_place text,
created_at timestamptz default now()
);
