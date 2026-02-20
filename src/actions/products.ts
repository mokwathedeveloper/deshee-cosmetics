'use server';

import { createClient } from '@/lib/supabase/server';
import type { Product, ProductWithImages } from '@/types/database';

export async function getProducts(options?: {
    categorySlug?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    status?: string;
}) {
    const supabase = await createClient();
    const page = options?.page || 1;
    const limit = options?.limit || 12;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('products')
        .select('*, product_images(*), categories(*)', { count: 'exact' });

    if (options?.status) {
        query = query.eq('status', options.status);
    }

    if (options?.categorySlug) {
        query = query.eq('categories.slug', options.categorySlug);
        // Need to filter by category_id via a subquery approach
        const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', options.categorySlug)
            .single();
        if (cat) {
            query = supabase
                .from('products')
                .select('*, product_images(*), categories(*)', { count: 'exact' })
                .eq('category_id', cat.id);
            if (options?.status) query = query.eq('status', options.status);
        }
    }

    if (options?.search) {
        query = query.ilike('name', `%${options.search}%`);
    }

    if (options?.minPrice !== undefined) {
        query = query.gte('price', options.minPrice);
    }

    if (options?.maxPrice !== undefined) {
        query = query.lte('price', options.maxPrice);
    }

    // Sorting
    switch (options?.sort) {
        case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
        case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        case 'rating':
            query = query.order('rating', { ascending: false });
            break;
        default:
            query = query.order('rating_count', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return { products: [] as ProductWithImages[], count: 0 };
    }

    return {
        products: (data || []) as ProductWithImages[],
        count: count || 0,
    };
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), categories(*)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data as ProductWithImages;
}

export async function getFeaturedProducts(limit = 4): Promise<ProductWithImages[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), categories(*)')
        .eq('status', 'active')
        .order('rating_count', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured products:', JSON.stringify(error, null, 2));
        return [];
    }

    return (data || []) as ProductWithImages[];
}

export async function createProduct(productData: Partial<Product>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

    if (error) return { error: error.message };
    return { product: data };
}

export async function updateProduct(id: string, productData: Partial<Product>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { product: data };
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

export async function addProductImage(productId: string, url: string, alt: string, sortOrder = 0) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('product_images')
        .insert({ product_id: productId, url, alt, sort_order: sortOrder });

    if (error) return { error: error.message };
    return { success: true };
}

export async function deleteProductImage(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

export async function getAdminDashboardStats() {
    const supabase = await createClient();

    const [productsRes, ordersRes, lowStockRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id, total, status, created_at'),
        supabase.from('products').select('id', { count: 'exact' }).lte('stock', 20),
    ]);

    const orders = ordersRes.data || [];
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

    return {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsRes.count || 0,
        lowStockAlerts: lowStockRes.count || 0,
        orders,
    };
}
