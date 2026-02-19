'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.categorySlug as string;
    const [products, setProducts] = useState<ProductWithImages[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState('popular');
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const supabase = createClient();

            const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
            setCategories((cats || []) as Category[]);

            const { data: cat } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', categorySlug)
                .single();
            setCategory(cat as Category);

            if (cat) {
                const { data: prods, count } = await supabase
                    .from('products')
                    .select('*, product_images(*), categories(*)', { count: 'exact' })
                    .eq('status', 'active')
                    .eq('category_id', cat.id)
                    .order(
                        sort === 'price-asc' ? 'price' : sort === 'price-desc' ? 'price' : sort === 'newest' ? 'created_at' : sort === 'rating' ? 'rating' : 'rating_count',
                        { ascending: sort === 'price-asc' }
                    );

                setProducts((prods || []) as ProductWithImages[]);
                setTotalCount(count || 0);
            }
            setLoading(false);
        }
        fetchData();
    }, [categorySlug, sort]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-rose-500 mb-2">
                    Category
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">
                    {category?.name || 'Category'}
                </h1>
                {category?.description && (
                    <p className="text-sm text-stone-400 mt-1">{category.description}</p>
                )}
            </div>

            <div className="flex gap-10">
                <div className="hidden md:block w-52 flex-shrink-0">
                    <FiltersSidebar categories={categories} activeCategory={categorySlug} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                        <p className="text-sm text-stone-400">
                            {totalCount} {totalCount === 1 ? 'product' : 'products'}
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="md:hidden flex items-center gap-1.5 text-sm text-stone-600 border border-stone-200 px-3 py-2 rounded-lg"
                            >
                                <SlidersHorizontal className="h-4 w-4" /> Filter
                            </button>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-rose-500/50 cursor-pointer"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filtersOpen && (
                        <div className="md:hidden mb-6 p-4 bg-stone-50 rounded-xl animate-fade-in-up">
                            <FiltersSidebar categories={categories} activeCategory={categorySlug} />
                        </div>
                    )}

                    {loading ? <LoadingState /> : <ProductGrid products={products} />}
                </div>
            </div>
        </div>
    );
}
