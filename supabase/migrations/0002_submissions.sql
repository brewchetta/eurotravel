-- User recommendations and the admin role.
-- Recommendations are `destinations` rows with status = 'pending'. They stay hidden
-- (the public policy only exposes 'approved') until an admin approves them.

-- Roles ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own role. Nobody can change roles through the API: there is no
-- insert or update policy, so promoting an admin is done in the SQL editor (see below).
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Accounts created before this migration.
insert into public.profiles (id)
select id from auth.users
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Destinations --------------------------------------------------------------------
-- "Approved destinations are public" (0001) stays as it is. These add to it.

drop policy if exists "Users can read their own submissions" on public.destinations;
create policy "Users can read their own submissions"
  on public.destinations
  for select
  to authenticated
  using (submitted_by = (select auth.uid()));

drop policy if exists "Admins can read every destination" on public.destinations;
create policy "Admins can read every destination"
  on public.destinations
  for select
  to authenticated
  using (public.is_admin());

-- A signed-in user can only add a pending, non-featured row that names them.
drop policy if exists "Users can submit destinations" on public.destinations;
create policy "Users can submit destinations"
  on public.destinations
  for insert
  to authenticated
  with check (
    status = 'pending'
    and featured = false
    and submitted_by = (select auth.uid())
  );

drop policy if exists "Admins can review destinations" on public.destinations;
create policy "Admins can review destinations"
  on public.destinations
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Make someone an admin (run in the Supabase SQL editor, with their email):
--   update public.profiles
--   set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
