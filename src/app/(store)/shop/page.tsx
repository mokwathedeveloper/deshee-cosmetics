'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/store/product-grid';
import { FiltersSidebar } from '@/components/store/filters-sidebar';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import type { ProductWithImages, Category } from '@/types/database';
import { SlidersHorizontal } from 'lucide-react';

const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
];

function ShopPageInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState<ProductWithImages[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const supabase = createClient();

            const [catRes, prodRes] = await Promise.all([
                supabase.from('categories').select('*').order('sort_order'),
                supabase
                    .from('products')
                    .select('*, product_images(*), categories(*)', { count: 'exact' })
                    .eq('status', 'active')
                    .order(
                        sort === 'price-asc' ? 'price' : sort === 'price-desc' ? 'price' : sort === 'newest' ? 'created_at' : sort === 'rating' ? 'rating' : 'rating_count',
                        { ascending: sort === 'price-asc' || sort === 'newest' ? sort === 'price-asc' : false }
                    ),
            ]);

            setCategories((catRes.data || []) as Category[]);
            setProducts((prodRes.data || []) as ProductWithImages[]);
            setTotalCount(prodRes.count || 0);
            setLoading(false);
        }
        fetchData();
    }, [sort]);

    function handleSortChange(value: string) {
        setSort(value);
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`/shop?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Page Header */}
            <div className="mb-8">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-rose-500 mb-2">
                    Collection
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">
                    All Products
                </h1>
            </div>

            <div className="flex gap-10">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-52 flex-shrink-0">
                    <FiltersSidebar categories={categories} />
                </div>

                {/* Products Area */}
                <div className="flex-1 min-w-0">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                        <p className="text-sm text-stone-400">
                            {totalCount} {totalCount === 1 ? 'product' : 'products'}
                        </p>
                        <div className="flex items-center gap-3">
                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="md:hidden flex items-center gap-1.5 text-sm text-stone-600 border border-stone-200 px-3 py-2 rounded-lg"
                            >
                                <SlidersHorizontal className="h-4 w-4" /> Filter
                            </button>
                            <select
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-rose-500/50 cursor-pointer"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    {filtersOpen && (
                        <div className="md:hidden mb-6 p-4 bg-stone-50 rounded-xl animate-fade-in-up">
                            <FiltersSidebar categories={categories} />
                        </div>
                    )}

                    {/* Grid */}
                    {loading ? <LoadingState /> : <ProductGrid products={products} />}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense>
            <ShopPageInner />
        </Suspense>
    );
}
