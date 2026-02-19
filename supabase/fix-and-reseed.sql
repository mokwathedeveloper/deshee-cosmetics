-- ============================================
-- MorganShop: Fix RLS + Re-seed (run this in Supabase SQL Editor)
-- ============================================

-- Step 1: Create is_admin() to prevent infinite recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer stable;

-- Step 2: Drop the broken policy that causes recursion
drop policy if exists "Admins can view all profiles" on public.profiles;

-- Step 3: Replace all admin policies with is_admin() versions

-- Categories
drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories" on public.categories for insert with check (public.is_admin());

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories" on public.categories for update using (public.is_admin());

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories" on public.categories for delete using (public.is_admin());

-- Products
drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products" on public.products for select using (public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update using (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete using (public.is_admin());

-- Product Images
drop policy if exists "Admins can insert product images" on public.product_images;
create policy "Admins can insert product images" on public.product_images for insert with check (public.is_admin());

drop policy if exists "Admins can update product images" on public.product_images;
create policy "Admins can update product images" on public.product_images for update using (public.is_admin());

drop policy if exists "Admins can delete product images" on public.product_images;
create policy "Admins can delete product images" on public.product_images for delete using (public.is_admin());

-- Orders
drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders" on public.orders for select using (public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders for update using (public.is_admin());

-- Order Items
drop policy if exists "Admins can read all order items" on public.order_items;
create policy "Admins can read all order items" on public.order_items for select using (public.is_admin());

-- Storage
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images storage" on storage.objects;
create policy "Admins can update product images storage" on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images storage" on storage.objects;
create policy "Admins can delete product images storage" on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- Step 4: Delete old seed data and re-seed with Unsplash images
delete from public.product_images;
delete from public.products;
delete from public.categories;

insert into public.categories (id, name, slug, description, image_url, is_featured, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', 'Skincare', 'skincare', 'Premium skincare products for every skin type', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Makeup', 'makeup', 'Discover your perfect look with our makeup collection', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Fragrance', 'fragrance', 'Luxury fragrances for every occasion', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Hair Care', 'hair-care', 'Professional hair care solutions', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Nail Care', 'nail-care', 'Complete nail care and polish collection', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Tools & Brushes', 'tools-brushes', 'Professional beauty tools and brushes', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', false, 6);

insert into public.products (id, name, slug, description, price, compare_at_price, stock, sku, status, brand, category_id, rating, rating_count) values
  ('a1000000-0000-0000-0000-000000000001', 'Hydrating Face Cream', 'hydrating-face-cream', 'Deep moisturizing face cream with hyaluronic acid and vitamin E for all skin types.', 49.99, 65.00, 45, 'SKN-HC-001', 'active', 'Luxe Beauty', 'c1000000-0000-0000-0000-000000000001', 4.8, 127),
  ('a1000000-0000-0000-0000-000000000002', 'Vitamin C Serum', 'vitamin-c-serum', 'Brightening vitamin C serum with antioxidants for radiant, youthful skin.', 39.99, null, 32, 'SKN-VC-002', 'active', 'Luxe Beauty', 'c1000000-0000-0000-0000-000000000001', 4.6, 89),
  ('a1000000-0000-0000-0000-000000000003', 'Matte Lipstick Collection', 'matte-lipstick-collection', 'Long-lasting matte lipstick in 12 stunning shades for the perfect pout.', 24.99, null, 68, 'MKP-ML-003', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000002', 4.7, 215),
  ('a1000000-0000-0000-0000-000000000004', 'Eyeshadow Palette', 'eyeshadow-palette', '18-shade eyeshadow palette with matte and shimmer finishes for endless looks.', 54.99, null, 28, 'MKP-EP-004', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000002', 4.9, 342),
  ('a1000000-0000-0000-0000-000000000005', 'Signature Eau de Parfum', 'signature-eau-de-parfum', 'Luxurious eau de parfum with notes of jasmine, amber, and sandalwood.', 89.99, 130.00, 15, 'FRG-SE-005', 'active', 'Signature Scents', 'c1000000-0000-0000-0000-000000000003', 4.5, 78),
  ('a1000000-0000-0000-0000-000000000006', 'Nourishing Shampoo', 'nourishing-shampoo', 'Sulfate-free shampoo with argan oil and biotin for stronger, healthier hair.', 29.99, null, 52, 'HRC-NS-006', 'active', 'Pure Essence', 'c1000000-0000-0000-0000-000000000004', 4.4, 156),
  ('a1000000-0000-0000-0000-000000000007', 'Gel Nail Polish Set', 'gel-nail-polish-set', 'Professional gel nail polish set with 8 trendy colors and UV lamp compatibility.', 34.99, null, 41, 'NLC-GP-007', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000005', 4.3, 92),
  ('a1000000-0000-0000-0000-000000000008', 'Professional Brush Set', 'professional-brush-set', '15-piece professional makeup brush set with synthetic bristles and travel case.', 69.99, null, 23, 'TLS-PB-008', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000006', 4.8, 167);

insert into public.product_images (product_id, url, alt, sort_order) values
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop', 'Hydrating Face Cream', 0),
  ('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', 'Vitamin C Serum', 0),
  ('a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 'Matte Lipstick Collection', 0),
  ('a1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop', 'Eyeshadow Palette', 0),
  ('a1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', 'Signature Eau de Parfum', 0),
  ('a1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop', 'Nourishing Shampoo', 0),
  ('a1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop', 'Gel Nail Polish Set', 0),
  ('a1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop', 'Professional Brush Set', 0);
