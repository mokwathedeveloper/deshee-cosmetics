'use server';

import { createClient } from '@/lib/supabase/server';

// ─── Types (local only — 'use server' files can only export async fns) ───
type ExternalProduct = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    sku: string;
    thumbnail: string;
    images: string[];
    tags: string[];
};

type MakeupAPIProduct = {
    id: number;
    brand: string | null;
    name: string;
    price: string | null;
    image_link: string;
    product_link: string;
    description: string | null;
    rating: number | null;
    product_type: string | null;
    tag_list: string[];
    product_colors: { hex_value: string; colour_name: string }[];
    api_featured_image: string;
};

// ─── Fetch from Makeup API (931 real products, 57+ real brands) ──
export async function fetchExternalProducts(
    category: string = 'lipstick',
    search?: string,
    page: number = 1,
    limit: number = 30,
): Promise<{ products: ExternalProduct[]; total: number }> {
    try {
        // Try Makeup API first (real brands, more products)
        if (!search || !search.trim()) {
            return await fetchFromMakeupAPI(category, page, limit);
        } else {
            // For search, try both APIs and combine
            return await searchProducts(search, page, limit);
        }
    } catch (error) {
        console.error('Error fetching external products:', error);
        return { products: [], total: 0 };
    }
}

// ─── Makeup API fetcher ─────────────────────────────────────────
async function fetchFromMakeupAPI(
    productType: string,
    page: number,
    limit: number,
): Promise<{ products: ExternalProduct[]; total: number }> {
    // Map our category keys to Makeup API product types
    const typeMap: Record<string, string> = {
        lipstick: 'lipstick',
        foundation: 'foundation',
        mascara: 'mascara',
        eyeshadow: 'eyeshadow',
        eyeliner: 'eyeliner',
        blush: 'blush',
        nail_polish: 'nail_polish',
        bronzer: 'bronzer',
        lip_liner: 'lip_liner',
        eyebrow: 'eyebrow',
        // DummyJSON fallback categories
        beauty: 'lipstick',
        'skin-care': 'foundation',
        fragrances: 'bronzer',
    };

    const apiType = typeMap[productType] || productType;
    const url = `http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${apiType}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Makeup API responded with ${res.status}`);

    const data: MakeupAPIProduct[] = await res.json();

    // Filter out products without images or prices
    const valid = data.filter(
        (p) => p.image_link && p.price && parseFloat(p.price) > 0,
    );

    const total = valid.length;
    const skip = (page - 1) * limit;
    const sliced = valid.slice(skip, skip + limit);

    return {
        products: sliced.map(mapMakeupProduct),
        total,
    };
}

// ─── Search across Makeup API ───────────────────────────────────
async function searchProducts(
    query: string,
    page: number,
    limit: number,
): Promise<{ products: ExternalProduct[]; total: number }> {
    // Search by brand name in Makeup API
    const brandUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '%20'))}`;

    const res = await fetch(brandUrl, { cache: 'no-store' });
    let allProducts: ExternalProduct[] = [];

    if (res.ok) {
        const data: MakeupAPIProduct[] = await res.json();
        const valid = data.filter(
            (p) => p.image_link && p.price && parseFloat(p.price) > 0,
        );
        allProducts = valid.map(mapMakeupProduct);
    }

    // If brand search returned few results, also search by product type
    if (allProducts.length < 5) {
        try {
            // Also try DummyJSON search as fallback
            const djUrl = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=30`;
            const djRes = await fetch(djUrl, { cache: 'no-store' });
            if (djRes.ok) {
                const djData = await djRes.json();
                const djProducts = (djData.products || []).map(mapDummyProduct);
                // Merge without duplicates (by title)
                const existingTitles = new Set(allProducts.map((p) => p.title.toLowerCase()));
                for (const p of djProducts) {
                    if (!existingTitles.has(p.title.toLowerCase())) {
                        allProducts.push(p);
                    }
                }
            }
        } catch {
            // Ignore DummyJSON errors
        }
    }

    const total = allProducts.length;
    const skip = (page - 1) * limit;
    const sliced = allProducts.slice(skip, skip + limit);

    return { products: sliced, total };
}

// ─── Map Makeup API product → our ExternalProduct format ────────
function mapMakeupProduct(p: MakeupAPIProduct): ExternalProduct {
    const price = parseFloat(p.price || '0');
    // Ensure HTTPS for images (handle http:// and protocol-relative //)
    const fixUrl = (url: string) => {
        if (url.startsWith('//')) return `https:${url}`;
        return url.replace(/^http:\/\//, 'https://');
    };
    const img = fixUrl(p.api_featured_image || p.image_link);
    return {
        id: p.id,
        title: p.name,
        description: p.description || `${p.brand || ''} ${p.product_type || ''} product`,
        category: p.product_type || 'beauty',
        price: price,
        discountPercentage: 0,
        rating: p.rating || Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        stock: Math.floor(Math.random() * 200) + 20,
        brand: (p.brand || 'Unknown').split(' ').map(w =>
            w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' '),
        sku: `MK-${p.id}`,
        thumbnail: img,
        images: [img],
        tags: p.tag_list || [],
    };
}

// ─── Map DummyJSON product → our ExternalProduct format ─────────
function mapDummyProduct(p: {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    sku: string;
    thumbnail: string;
    images: string[];
    tags: string[];
}): ExternalProduct {
    return {
        id: p.id + 100000, // offset to avoid ID collision
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,
        discountPercentage: p.discountPercentage || 0,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand,
        sku: p.sku,
        thumbnail: p.thumbnail,
        images: p.images || [p.thumbnail],
        tags: p.tags || [],
    };
}

// ─── Check if already imported (by SKU) ─────────────────────────
export async function checkImportedSkus(skus: string[]): Promise<string[]> {
    const supabase = await createClient();
    const { data } = await supabase
        .from('products')
        .select('sku')
        .in('sku', skus);

    return (data || []).map((p) => p.sku).filter(Boolean);
}

// ─── Slug generator ─────────────────────────────────────────────
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// ─── Import a single product ────────────────────────────────────
export async function importProduct(
    ext: ExternalProduct,
    categoryId: string | null,
) {
    const supabase = await createClient();

    // Check duplicate
    const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('sku', ext.sku)
        .maybeSingle();

    if (existing) {
        return { error: 'Product with this SKU already exists.' };
    }

    // Calculate compare_at_price from discount percentage
    const compareAtPrice =
        ext.discountPercentage > 0
            ? Math.round((ext.price / (1 - ext.discountPercentage / 100)) * 100) / 100
            : null;

    // Generate unique slug
    let slug = generateSlug(ext.title);
    // Truncate slug to reasonable length
    if (slug.length > 80) slug = slug.substring(0, 80).replace(/-$/, '');
    const { data: slugCheck } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
    if (slugCheck) {
        slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Insert product
    const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
            name: ext.title,
            slug,
            description: ext.description,
            price: ext.price,
            compare_at_price: compareAtPrice,
            stock: ext.stock,
            sku: ext.sku,
            brand: ext.brand || null,
            category_id: categoryId,
            rating: ext.rating,
            rating_count: Math.floor(Math.random() * 200) + 10,
            status: 'active' as const,
        })
        .select()
        .single();

    if (productError) {
        return { error: productError.message };
    }

    // Insert product images
    const images = ext.images.length > 0 ? ext.images : [ext.thumbnail];
    for (let i = 0; i < images.length; i++) {
        await supabase.from('product_images').insert({
            product_id: product.id,
            url: images[i],
            alt: ext.title,
            sort_order: i,
        });
    }

    return { product };
}

// ─── Bulk import ────────────────────────────────────────────────
export async function importProducts(
    products: ExternalProduct[],
    categoryId: string | null,
) {
    const results: { title: string; success: boolean; error?: string }[] = [];

    for (const ext of products) {
        const result = await importProduct(ext, categoryId);
        results.push({
            title: ext.title,
            success: !result.error,
            error: result.error,
        });
    }

    return results;
}
