create table
shifts (
id bigint primary key generated always as identity,
user_id uuid references auth.users not null,
shift_status text,
confirm_shift text,
start_workingtime timestamptz,
finish_workingtime timestamptz,
created_at timestamptz default now()
);
