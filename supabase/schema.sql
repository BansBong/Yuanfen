-- ============================================================================
--  Yuanfen: Supabase schema (single source of truth)
--
--  Run this ONCE in a FRESH Supabase project:
--    Dashboard -> SQL Editor -> New query -> paste everything -> Run.
--  It is safe to re-run: every statement is idempotent where practical.
--
--  Security model
--    * Row Level Security is ON for every table.
--    * Anonymous visitors can INSERT requests and nothing else (never read).
--    * Admins (profiles.role = 'admin') can read/update requests and read profiles.
--    * Roles other than 'admin' are scaffolded for later; nothing uses them yet.
--    * The website server inserts requests with the service-role key (server only).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'staff', 'guide', 'client');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_type as enum (
    'tour', 'jastip', 'medical', 'admission',
    'destination_request', 'partnership', 'guide_application', 'contact'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_status as enum ('new', 'contacted', 'quoted', 'won', 'closed');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url   text,
  role         public.user_role not null default 'client',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.requests (
  id             uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  type           public.request_type not null,
  locale         text not null default 'en' check (locale in ('en', 'id')),
  name           text not null check (char_length(name) between 1 and 200),
  contact        text not null check (char_length(contact) between 3 and 200),
  contact_type   text not null default 'other' check (contact_type in ('email', 'phone', 'other')),
  details        jsonb not null default '{}'::jsonb,
  status         public.request_status not null default 'new',
  assigned_to    uuid references public.profiles (id) on delete set null,
  internal_notes text,
  -- which admin last changed the workflow fields (traceability)
  last_updated_by uuid references public.profiles (id) on delete set null,
  -- salted hash of the sender's IP, used only for rate limiting
  ip_hash        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists requests_created_at_idx on public.requests (created_at desc);
create index if not exists requests_type_idx       on public.requests (type);
create index if not exists requests_status_idx     on public.requests (status);
create index if not exists requests_assigned_idx   on public.requests (assigned_to);
create index if not exists requests_ip_recent_idx  on public.requests (ip_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- Helper: is the current user an admin?
-- SECURITY DEFINER so policies on profiles can call it without recursion.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists requests_touch on public.requests;
create trigger requests_touch before update on public.requests
  for each row execute function public.touch_updated_at();

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Create a profile row whenever someone is added to Authentication -> Users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.requests enable row level security;

-- Start from nothing, then grant only what is needed.
revoke all on public.profiles from anon, authenticated;
revoke all on public.requests from anon, authenticated;

-- requests: anyone may insert a NEW, unassigned request. Nobody anonymous can read.
grant insert on public.requests to anon, authenticated;
grant select on public.requests to authenticated;
-- admins may change only the workflow columns, never the submitted answers
grant update (status, assigned_to, internal_notes, last_updated_by) on public.requests to authenticated;

drop policy if exists requests_insert_public on public.requests;
create policy requests_insert_public on public.requests
  for insert to anon, authenticated
  with check (status = 'new' and assigned_to is null and internal_notes is null);

drop policy if exists requests_admin_select on public.requests;
create policy requests_admin_select on public.requests
  for select to authenticated using (public.is_admin());

drop policy if exists requests_admin_update on public.requests;
create policy requests_admin_update on public.requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- profiles: you can read your own; admins can read everyone (for "assign to" lists).
grant select on public.profiles to authenticated;
-- Name and photo are editable. The ROLE column is deliberately not grantable:
-- change roles in the SQL editor (see README), so nobody can promote themselves.
grant update (display_name, avatar_url) on public.profiles to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists profiles_admin_select on public.profiles;
create policy profiles_admin_select on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Market research: how many requests per place (admins only, via RLS)
-- ---------------------------------------------------------------------------
create or replace function public.place_counts()
returns table (source text, place text, total bigint, last_at timestamptz)
language sql
stable
security invoker
set search_path = public
as $$
  select 'destination_request'::text,
         lower(trim(details ->> 'place')),
         count(*),
         max(created_at)
  from public.requests
  where type = 'destination_request' and coalesce(details ->> 'place', '') <> ''
  group by 2
  union all
  select 'tour'::text,
         lower(trim(details ->> 'destination')),
         count(*),
         max(created_at)
  from public.requests
  where type = 'tour' and coalesce(details ->> 'destination', '') <> ''
  group by 2
  order by 3 desc;
$$;

grant execute on function public.place_counts() to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: profile photos (public read, each admin writes to their own folder)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists avatars_insert_own on storage.objects;
create policy avatars_insert_own on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_update_own on storage.objects;
create policy avatars_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_delete_own on storage.objects;
create policy avatars_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- Later (NOT built yet; the schema above leaves room for them):
--   * guide / client roles: profiles.role already has the values
--   * a tasks table, points / rewards: add new tables that reference profiles(id)
-- ---------------------------------------------------------------------------
