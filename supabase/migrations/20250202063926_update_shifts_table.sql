-- テーブルが存在する場合は削除
DROP TABLE IF EXISTS public.shifts;

-- 新しい構造でテーブルを作成
CREATE TABLE public.shifts (
  id BIGSERIAL PRIMARY KEY, 
  user_id uuid references auth.users not null,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  from_time timestamp with time zone NOT NULL,
  to_time timestamp with time zone NOT NULL
);
