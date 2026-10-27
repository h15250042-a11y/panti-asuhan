# Pantibersinar

Project Next.js + Supabase untuk website organisasi dan donasi.

## Langkah setup
1. cp .env.example .env.local
2. isi URL dan key Supabase
3. npm install
4. npm run dev

## Database
Buka Supabase SQL Editor dan jalankan file SQL berikut:

```sql
create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  banner_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  donor_name text not null default 'Anonim',
  amount numeric not null default 0,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false
);

alter table public.organizations enable row level security;
alter table public.donations enable row level security;
alter table public.profiles enable row level security;

create policy "Public read organizations"
on public.organizations for select
using (true);

create policy "Public read donations"
on public.donations for select
using (true);

create policy "Public insert donations"
on public.donations for insert
with check (true);

create policy "Read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Admins can insert organizations"
on public.organizations for insert
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  )
);

create policy "Admins can update organizations"
on public.organizations for update
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  )
);

create policy "Admins can delete organizations"
on public.organizations for delete
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  )
);
