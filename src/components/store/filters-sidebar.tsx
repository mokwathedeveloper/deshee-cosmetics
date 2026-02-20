'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Category } from '@/types/database';
import { Suspense } from 'react';

interface FiltersSidebarProps {
    categories: Category[];
    activeCategory?: string;
}

function FiltersSidebarInner({ categories, activeCategory }: FiltersSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    function applyPrice(min: string, max: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (min) params.set('minPrice', min);
        else params.delete('minPrice');
        if (max) params.set('maxPrice', max);
        else params.delete('maxPrice');
        router.push(`${pathname}?${params.toString()}`);
    }

    const hasFilters = activeCategory || minPrice || maxPrice;

    return (
        <aside className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    Categories
                </h3>
                <ul className="space-y-1">
                    <li>
                        <Link
                            href="/shop"
                            className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${!activeCategory
                                ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            All Products
                        </Link>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                href={`/shop/${cat.slug}`}
                                className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${activeCategory === cat.slug
                                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                    : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    Price Range
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => applyPrice(e.target.value, maxPrice)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <span className="text-muted-foreground/50 text-xs">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => applyPrice(minPrice, e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Reset */}
            {hasFilters && (
                <Link
                    href="/shop"
                    className="inline-flex items-center text-xs text-primary hover:text-primary/80 font-semibold transition-colors group"
                >
                    <span className="mr-1 group-hover:-translate-x-0.5 transition-transform">←</span> Reset all filters
                </Link>
            )}
        </aside>
    );
}

export function FiltersSidebar(props: FiltersSidebarProps) {
    return (
        <Suspense>
            <FiltersSidebarInner {...props} />
        </Suspense>
    );
}
