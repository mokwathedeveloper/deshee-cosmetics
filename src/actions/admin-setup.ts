'use server';

import { createClient } from '@/lib/supabase/server';

// ─── Beauty store categories ────────────────────────────────────
const BEAUTY_CATEGORIES = [
    {
        name: 'Lipstick & Lip Care',
        slug: 'lipstick-lip-care',
        description: 'Lipsticks, lip glosses, lip liners, and lip balms from top brands',
        is_featured: true,
        sort_order: 1,
    },
    {
        name: 'Foundation & Face',
        slug: 'foundation-face',
        description: 'Foundations, concealers, primers, and face powders',
        is_featured: true,
        sort_order: 2,
    },
    {
        name: 'Eye Makeup',
        slug: 'eye-makeup',
        description: 'Mascara, eyeshadow, eyeliner, and eyebrow products',
        is_featured: true,
        sort_order: 3,
    },
    {
        name: 'Blush & Bronzer',
        slug: 'blush-bronzer',
        description: 'Blush, bronzer, highlighter, and contouring products',
        is_featured: true,
        sort_order: 4,
    },
    {
        name: 'Nail Care',
        slug: 'nail-care',
        description: 'Nail polish, nail treatments, and nail art',
        is_featured: false,
        sort_order: 5,
    },
    {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Moisturizers, serums, cleansers, and skincare treatments',
        is_featured: true,
        sort_order: 6,
    },
    {
        name: 'Fragrances',
        slug: 'fragrances',
        description: 'Perfumes, body mists, and fragrance sets',
        is_featured: false,
        sort_order: 7,
    },
    {
        name: 'Hair Care',
        slug: 'hair-care',
        description: 'Shampoo, conditioner, hair treatments, and styling products',
        is_featured: false,
        sort_order: 8,
    },
];

// ─── Clean all products & images from database ──────────────────
export async function cleanProducts(): Promise<{ success: boolean; deleted: number; error?: string }> {
    const supabase = await createClient();

    // Count products first
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    // Delete all product images first (cascade should handle this, but be explicit)
    await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Delete all products
    const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
        return { success: false, deleted: 0, error: error.message };
    }

    return { success: true, deleted: count || 0 };
}

// ─── Clean all categories and replace with beauty categories ────
export async function setupBeautyCategories(): Promise<{
    success: boolean;
    categories: { name: string; id: string }[];
    error?: string;
}> {
    const supabase = await createClient();

    // Delete existing categories (products should be cleaned first)
    await supabase
        .from('categories')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert beauty categories
    const { data, error } = await supabase
        .from('categories')
        .insert(BEAUTY_CATEGORIES)
        .select('id, name');

    if (error) {
        return { success: false, categories: [], error: error.message };
    }

    return {
        success: true,
        categories: (data || []).map((c) => ({ name: c.name, id: c.id })),
    };
}

// ─── Full reset: clean everything and setup fresh ───────────────
export async function fullDatabaseReset(): Promise<{
    success: boolean;
    productsDeleted: number;
    categoriesCreated: number;
    error?: string;
}> {
    // Step 1: Clean products
    const cleanResult = await cleanProducts();
    if (!cleanResult.success) {
        return {
            success: false,
            productsDeleted: 0,
            categoriesCreated: 0,
            error: `Failed to clean products: ${cleanResult.error}`,
        };
    }

    // Step 2: Setup categories
    const catResult = await setupBeautyCategories();
    if (!catResult.success) {
        return {
            success: false,
            productsDeleted: cleanResult.deleted,
            categoriesCreated: 0,
            error: `Failed to setup categories: ${catResult.error}`,
        };
    }

    return {
        success: true,
        productsDeleted: cleanResult.deleted,
        categoriesCreated: catResult.categories.length,
    };
}
