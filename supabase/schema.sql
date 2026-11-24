-- INKED. Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'artist' check (role in ('artist','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id,email) values (new.id,new.email)
  on conflict (id) do update set email=excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.tattoo_styles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  image_url text,
  sort_order int not null default 0,
  active boolean not null default true
);
create table if not exists public.tattoo_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  popular boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0
);
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text not null,
  email text not null,
  phone text not null,
  packages jsonb not null default '[]'::jsonb,
  style text,
  placement text,
  idea text,
  payment_method text,
  reference_images jsonb not null default '[]'::jsonb,
  appointment_date date not null,
  appointment_time text not null check (appointment_time in ('11:00','14:00','17:00')),
  total_amount numeric(10,2) not null check (total_amount >= 0),
  deposit_amount numeric(10,2) not null check (deposit_amount >= 0),
  balance_amount numeric(10,2) not null check (balance_amount >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Prevent two active requests from claiming the same artist/time slot.
create unique index if not exists bookings_unique_active_slot
on public.bookings (appointment_date, appointment_time)
where status <> 'cancelled';
create index if not exists bookings_date_idx on public.bookings (appointment_date, status);

alter table public.profiles enable row level security;
alter table public.tattoo_styles enable row level security;
alter table public.tattoo_packages enable row level security;
alter table public.gallery_items enable row level security;
alter table public.bookings enable row level security;

-- Public read-only catalog access. Writes are reserved for trusted server/admin tooling.
drop policy if exists "Public can read active styles" on public.tattoo_styles;
create policy "Public can read active styles" on public.tattoo_styles for select using (active = true);
drop policy if exists "Public can read active packages" on public.tattoo_packages;
create policy "Public can read active packages" on public.tattoo_packages for select using (active = true);
drop policy if exists "Public can read published gallery" on public.gallery_items;
create policy "Public can read published gallery" on public.gallery_items for select using (published = true);

-- A signed-in user can read only their own profile. Admin role checks are used by the dashboard.
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Admins read bookings" on public.bookings;
create policy "Admins read bookings" on public.bookings for select to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
drop policy if exists "Admins update bookings" on public.bookings;
create policy "Admins update bookings" on public.bookings for update to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

insert into public.tattoo_styles (name,description,sort_order) values
('Fine line','Delicate single-needle detail for florals, script and small symbols.',1),
('Minimalist','A few clean lines with a lot of space around them.',2),
('Blackwork','Solid black shapes and heavy contrast.',3),
('Realism','Portraits and objects with soft shading and depth.',4),
('Japanese','Waves, koi and dragons inspired by traditional irezumi.',5),
('Traditional','Bold outlines and a limited colour palette.',6),
('Tribal','Strong, curved shapes with expressive movement.',7),
('Lettering','Names, dates and quotes in custom hand-drawn type.',8),
('Geometric','Symmetry, dot work and considered sacred patterns.',9),
('Custom design','A one-of-one concept built around your story.',10)
on conflict (name) do nothing;

insert into public.tattoo_packages (name,description,price,popular,sort_order) values
('Small tattoo','A single simple design up to 2 inches. Symbols, initials or a small flash piece.',60,false,1),
('Name tattoo','Precision typography, cursive, gothic or micro-script custom lettering.',125,false,2),
('3 small tattoos','A bundle of three delicate fine-line or flash designs up to 2 inches each.',150,true,3),
('Half neck','Side-neck, throat or nape placement crafted for your anatomy.',200,false,4),
('Quarter sleeve','A focused upper arm, lower forearm or shoulder composition.',250,false,5),
('Half sleeve','A comprehensive upper arm or forearm sleeve tailored to your contours.',300,true,6),
('Full sleeve','A full-length arm composition, usually completed across multiple sessions.',600,false,7),
('Back piece','A large-scale composition across the back, built over several sessions.',900,false,8)
on conflict (name) do nothing;

-- Private storage for client-uploaded tattoo reference images. Uploads are written
-- server-side with the Supabase service role; never expose that key in the browser.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('booking-references', 'booking-references', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

alter table public.bookings add column if not exists payment_method text;
alter table public.bookings add column if not exists reference_images jsonb not null default '[]'::jsonb;
