-- ローカル環境のみRLSを無効化
-- 実行矢印 supabase db push supabase/migrations/disable_rls_dev.sql --db-url postgresql://postgres:postgres@localhost:54322/postgres
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;

