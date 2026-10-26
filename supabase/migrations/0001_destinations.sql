-- Destinations shown on the site.
-- `status` and `submitted_by` are here from the start so that user suggestions and
-- admin approval can be added later without reshaping the table.

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  country text not null,
  country_code char(2) not null,
  region text not null
    check (region in ('riviera', 'alpine', 'nordic', 'atlantic', 'campagna', 'capitals')),
  best_season text not null
    check (best_season in ('spring', 'summer', 'autumn', 'winter')),
  -- Zero-based months (0 = January). A range such as December to February wraps the year.
  best_start_month smallint not null check (best_start_month between 0 and 11),
  best_end_month smallint not null check (best_end_month between 0 and 11),
  summary text not null,
  description text not null,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  currency_code char(3) not null,
  image_url text not null,
  image_alt text not null,
  photographer text not null,
  photographer_url text not null,
  featured boolean not null default false,
  status text not null default 'approved'
    check (status in ('approved', 'pending', 'rejected')),
  submitted_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists destinations_status_idx on public.destinations (status);

alter table public.destinations enable row level security;

-- Anyone may read approved destinations. Insert and update policies for suggestions and
-- the admin role arrive with auth.
drop policy if exists "Approved destinations are public" on public.destinations;
create policy "Approved destinations are public"
  on public.destinations
  for select
  using (status = 'approved');
