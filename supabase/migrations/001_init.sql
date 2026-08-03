-- Portfolio CMS data store: a single JSONB document per portfolio.
-- Run this in the Supabase SQL editor (or via supabase db push).

create table if not exists public.portfolio (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- The portfolio is private to the server (which uses the service-role key).
-- RLS is enabled with no policies, so `anon` and `authenticated` roles have
-- zero access. Only the service role / table owner can read or write.
alter table public.portfolio enable row level security;
