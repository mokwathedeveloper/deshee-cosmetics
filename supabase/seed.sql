-- ============================================
-- Seed Data for MorganShop
-- ============================================

-- Categories
insert into public.categories (id, name, slug, description, image_url, is_featured, sort_order) values
  ('c1000000-0000-0000-0000-000000000001', 'Skincare', 'skincare', 'Premium skincare products for every skin type', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Makeup', 'makeup', 'Discover your perfect look with our makeup collection', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Fragrance', 'fragrance', 'Luxury fragrances for every occasion', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Hair Care', 'hair-care', 'Professional hair care solutions', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Nail Care', 'nail-care', 'Complete nail care and polish collection', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Tools & Brushes', 'tools-brushes', 'Professional beauty tools and brushes', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', false, 6)
on conflict (slug) do nothing;

-- Products
insert into public.products (id, name, slug, description, price, compare_at_price, stock, sku, status, brand, category_id, rating, rating_count, is_featured) values
  ('a1000000-0000-0000-0000-000000000001', 'Hydrating Face Cream', 'hydrating-face-cream', 'Deep moisturizing face cream with hyaluronic acid and vitamin E for all skin types.', 49.99, 65.00, 45, 'SKN-HC-001', 'active', 'Luxe Beauty', 'c1000000-0000-0000-0000-000000000001', 4.8, 127, true),
  ('a1000000-0000-0000-0000-000000000002', 'Vitamin C Serum', 'vitamin-c-serum', 'Brightening vitamin C serum with antioxidants for radiant, youthful skin.', 39.99, null, 32, 'SKN-VC-002', 'active', 'Luxe Beauty', 'c1000000-0000-0000-0000-000000000001', 4.6, 89, true),
  ('a1000000-0000-0000-0000-000000000003', 'Matte Lipstick Collection', 'matte-lipstick-collection', 'Long-lasting matte lipstick in 12 stunning shades for the perfect pout.', 24.99, null, 68, 'MKP-ML-003', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000002', 4.7, 215, true),
  ('a1000000-0000-0000-0000-000000000004', 'Eyeshadow Palette', 'eyeshadow-palette', '18-shade eyeshadow palette with matte and shimmer finishes for endless looks.', 54.99, null, 28, 'MKP-EP-004', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000002', 4.9, 342, true),
  ('a1000000-0000-0000-0000-000000000005', 'Signature Eau de Parfum', 'signature-eau-de-parfum', 'Luxurious eau de parfum with notes of jasmine, amber, and sandalwood.', 89.99, 130.00, 15, 'FRG-SE-005', 'active', 'Signature Scents', 'c1000000-0000-0000-0000-000000000003', 4.5, 78, false),
  ('a1000000-0000-0000-0000-000000000006', 'Nourishing Shampoo', 'nourishing-shampoo', 'Sulfate-free shampoo with argan oil and biotin for stronger, healthier hair.', 29.99, null, 52, 'HRC-NS-006', 'active', 'Pure Essence', 'c1000000-0000-0000-0000-000000000004', 4.4, 156, false),
  ('a1000000-0000-0000-0000-000000000007', 'Gel Nail Polish Set', 'gel-nail-polish-set', 'Professional gel nail polish set with 8 trendy colors and UV lamp compatibility.', 34.99, null, 41, 'NLC-GP-007', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000005', 4.3, 92, false),
  ('a1000000-0000-0000-0000-000000000008', 'Professional Brush Set', 'professional-brush-set', '15-piece professional makeup brush set with synthetic bristles and travel case.', 69.99, null, 23, 'TLS-PB-008', 'active', 'Glow Cosmetics', 'c1000000-0000-0000-0000-000000000006', 4.8, 167, false),
  ('a1000000-0000-0000-0000-000000000009', 'Sunscreen Lotion SPF 50', 'sunscreen-lotion-spf-50', 'Broad-spectrum SPF 50 sunscreen for face and body. Water-resistant and non-greasy formula.', 22.99, 28.00, 75, 'SKN-SL-009', 'active', 'Luxe Beauty', 'c1000000-0000-0000-0000-000000000001', 4.9, 189, true),
  ('a1000000-0000-0000-0000-000000000010', '24K Gold Eye Masks', '24k-gold-eye-masks', 'Hydrating under-eye masks with 24K gold to reduce dark circles and puffiness.', 19.99, null, 50, 'SKN-EM-010', 'active', 'Luxe Beauty', 'c1000000-0000-0000-0000-000000000001', 4.7, 98, true),
  ('a1000000-0000-0000-0000-000000000011', 'Organic Rosewater Toner', 'organic-rosewater-toner', '100% pure and organic rosewater toner to soothe, hydrate, and refresh your skin.', 25.99, null, 60, 'SKN-RT-011', 'active', 'Pure Essence', 'c1000000-0000-0000-0000-000000000001', 4.8, 112, true),
  ('a1000000-0000-0000-0000-000000000012', 'Charcoal Detox Mask', 'charcoal-detox-mask', 'Deep-cleansing charcoal mask to draw out impurities, unclog pores, and revitalize your skin.', 29.99, 35.00, 40, 'SKN-CM-012', 'active', 'Luxe Beauty', 'c1000000-0000-0000-0000-000000000001', 4.6, 75, true)
on conflict (slug) do nothing;

-- Product Images
insert into public.product_images (product_id, url, alt, sort_order) values
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop', 'Hydrating Face Cream', 0),
  ('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', 'Vitamin C Serum', 0),
  ('a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 'Matte Lipstick Collection', 0),
  ('a1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=600&fit=crop', 'Eyeshadow Palette', 0),
  ('a1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', 'Signature Eau de Parfum', 0),
  ('a1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop', 'Nourishing Shampoo', 0),
  ('a1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop', 'Gel Nail Polish Set', 0),
  ('a1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop', 'Professional Brush Set', 0),
  ('a1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1521223619143-6512d4fb55a1?w=600&h=600&fit=crop', 'Sunscreen Lotion SPF 50', 0),
  ('a1000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1599305102319-ac20a2e48549?w=600&h=600&fit=crop', '24K Gold Eye Masks', 0),
  ('a1000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1598449032822-942f9b8352f7?w=600&h=600&fit=crop', 'Organic Rosewater Toner', 0),
  ('a1000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1598588228316-563855648b29?w=600&h=600&fit=crop', 'Charcoal Detox Mask', 0);
