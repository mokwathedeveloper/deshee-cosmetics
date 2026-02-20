'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductGrid } from '@/components/store/product-grid';
import { FiltersSidebar } from '@/components/store/filters-sidebar';
import { LoadingState } from '@/components/ui/loading-state';
import { createClient } from '@/lib/supabase/client';
import type { ProductWithImages, Category } from '@/types/database';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="container py-12 md:py-16">
            <div className="mb-12">
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-3 animate-in fade-in slide-in-from-bottom duration-500">
                    Category
                </p>
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight animate-in fade-in slide-in-from-bottom duration-700 delay-100 uppercase">
                    {category?.name || 'Collection'}
                </h1>
                {category?.description && (
                    <p className="text-base text-muted-foreground mt-4 max-w-2xl animate-in fade-in duration-1000 delay-200">{category.description}</p>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                <div className="hidden md:block w-64 flex-shrink-0 sticky top-24 h-fit">
                    <FiltersSidebar categories={categories} activeCategory={categorySlug} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/40">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {totalCount} {totalCount === 1 ? 'product' : 'products'} in {category?.name}
                        </p>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="md:hidden flex items-center gap-2 rounded-full px-5 h-10 border-border text-xs font-bold uppercase tracking-widest"
                            >
                                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
                            </Button>
                            <div className="relative group">
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="appearance-none px-6 py-2.5 pr-10 border border-border rounded-full text-[11px] font-bold uppercase tracking-widest bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:bg-muted/50 w-full sm:w-auto h-10 shadow-sm"
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>

                    {filtersOpen && (
                        <div className="md:hidden mb-10 p-8 bg-muted/30 rounded-[32px] border border-border/40 animate-in fade-in slide-in-from-top duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest">Filters</h3>
                                <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)} className="rounded-full h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <FiltersSidebar categories={categories} activeCategory={categorySlug} />
                        </div>
                    )}

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <LoadingState />
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-1000">
                            <ProductGrid products={products} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
