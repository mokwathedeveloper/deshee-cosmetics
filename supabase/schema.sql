-- ============================================
-- MorganShop Database Schema (v2 — fixed RLS)
-- ============================================

-- Helper function: check if current user is admin
-- Uses SECURITY DEFINER to bypass RLS and avoid infinite recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer stable;

-- 1) Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text check (role in ('customer', 'admin')) default 'customer',
  created_at timestamptz default now()
);

-- 2) Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 3) Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock int not null default 0,
  sku text,
  status text check (status in ('active', 'inactive')) default 'active',
  brand text,
  category_id uuid references public.categories(id),
  rating numeric(2,1) default 0,
  rating_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4) Product Images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int default 0
);

-- 5) Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  order_number text unique not null,
  status text check (status in ('new', 'processing', 'shipped', 'delivered', 'cancelled')) default 'new',
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  currency text default 'USD',
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  shipping_city text,
  notes text,
  created_at timestamptz default now()
);

-- 6) Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null,
  line_total numeric(10,2) not null
);

-- ============================================
-- Triggers
-- ============================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'customer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at on products
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

-- ============================================
-- RLS Policies (using is_admin() to avoid recursion)
-- ============================================

-- Profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- No separate "admins can view all profiles" policy needed here
-- because is_admin() uses security definer and the admin can manage
-- everything through server actions with service role if needed.

-- Categories (public read, admin write)
alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
  on public.categories for insert
  with check (public.is_admin());

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories"
  on public.categories for update
  using (public.is_admin());

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories"
  on public.categories for delete
  using (public.is_admin());

-- Products (public read active, admin full CRUD)
alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (status = 'active');

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
  on public.products for select
  using (public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  using (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- Product Images (public read, admin CRUD)
alter table public.product_images enable row level security;

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images"
  on public.product_images for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert product images" on public.product_images;
create policy "Admins can insert product images"
  on public.product_images for insert
  with check (public.is_admin());

drop policy if exists "Admins can update product images" on public.product_images;
create policy "Admins can update product images"
  on public.product_images for update
  using (public.is_admin());

drop policy if exists "Admins can delete product images" on public.product_images;
create policy "Admins can delete product images"
  on public.product_images for delete
  using (public.is_admin());

-- Orders
alter table public.orders enable row level security;

drop policy if exists "Customers can read own orders" on public.orders;
create policy "Customers can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "Authenticated users can insert orders" on public.orders;
create policy "Authenticated users can insert orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

-- Order Items
alter table public.order_items enable row level security;

drop policy if exists "Customers can read own order items" on public.order_items;
create policy "Customers can read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can read all order items" on public.order_items;
create policy "Admins can read all order items"
  on public.order_items for select
  using (public.is_admin());

drop policy if exists "Authenticated users can insert order items" on public.order_items;
create policy "Authenticated users can insert order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- ============================================
-- Storage
-- ============================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

drop policy if exists "Public can read product images storage" on storage.objects;
create policy "Public can read product images storage"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

drop policy if exists "Admins can update product images storage" on storage.objects;
create policy "Admins can update product images storage"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );

drop policy if exists "Admins can delete product images storage" on storage.objects;
create policy "Admins can delete product images storage"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );
