
-- supabase db reset　ローカルのdbに反映
-- supabase migration new hoge マイグレーションを追加
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at)
  values ('00000000-0000-0000-0000-000000000000', '185f2f83-d63a-4c9b-b4a0-7e4a885799e2', 'authenticated', 'authenticated', 'my@email.com', '$2a$10$6gPtvpqCAiwavx1EOnjIgOykKMgzRdiBuejUQGIRRjvUi/ZgMh.9C', '{"provider":"email","providers":["email"]}', '{"displayName": "チャンス大城"}', timezone('utc'::text, now()), timezone('utc'::text, now())),
         ('00000000-0000-0000-0000-000000000001', '185f2f83-d63a-4c9b-b4a0-7e4a885799e3', 'authenticated', 'authenticated', 'oira@email.com', '$2a$10$6gPtvpqCAiwavx1EOnjIgOykKMgzRdiBuejUQGIRRjvUi/ZgMh.9C', '{"provider":"email","providers":["email"]}', '{"displayName": "アントニー川崎"}', timezone('utc'::text, now()), timezone('utc'::text, now())),
         ('00000000-0000-0000-0000-000000000002', '185f2f83-d63a-4c9b-b4a0-7e4a885799e1', 'authenticated', 'authenticated', '2my@email.com', '$2a$10$6gPtvpqCAiwavx1EOnjIgOykKMgzRdiBuejUQGIRRjvUi/ZgMh.9C', '{"provider":"email","providers":["email"]}', '{"displayName": "ジミー大西"}', timezone('utc'::text, now()), timezone('utc'::text, now()));

INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            id as user_id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
        where
            email IN ('my@email.com', '2my@email.com','oira@email.com')
    );


insert into
public.employees (name)
values
('Erlich Bachmanオラオ'),
('Richard Hendricks'),
('Monica Hall');

INSERT INTO
public.profiles (id,user_name,user_type,work_place,created_at)
VALUES
((SELECT id FROM auth.users WHERE email = 'my@email.com'),'チャンス大城','admin','堂山餃子チャオズ',timezone('utc'::text, now())),
((SELECT id FROM auth.users WHERE email = 'oira@email.com'),'アントニー川崎','admin','堂山餃子チャオズ',timezone('utc'::text, now())),
((SELECT id FROM auth.users WHERE email = '2my@email.com'),'ジミー大西','worker','堂山餃子チャオズ',timezone('utc'::text, now()));

INSERT INTO public.shifts (user_id, created_at,from_time,to_time) 
VALUES
  ((SELECT id FROM auth.users WHERE email = 'my@email.com'), '2025-01-28 09:00:00+00','2024-12-08 07:30:00','2024-12-08 09:30:00'),
  ((SELECT id FROM auth.users WHERE email = 'my@email.com'), '2025-01-28 09:00:00+00','2024-12-08 09:30:00','2024-12-08 12:30:00'),
  ((SELECT id FROM auth.users WHERE email = 'oira@email.com'), '2025-01-28 09:00:00+00','2024-12-08 09:30:00','2024-12-08 12:30:00'),
  ((SELECT id FROM auth.users WHERE email = '2my@email.com'), '2025-01-28 09:00:00+00','2024-12-08 07:30:00','2024-12-08 09:30:00'),
  ((SELECT id FROM auth.users WHERE email = '2my@email.com'), '2025-01-28 09:00:00+00','2024-12-07 07:30:00','2024-12-07 09:30:00');
