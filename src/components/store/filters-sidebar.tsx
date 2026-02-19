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
        <aside className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-3">
                    Categories
                </h3>
                <ul className="space-y-0.5">
                    <li>
                        <Link
                            href="/shop"
                            className={`block px-3 py-2 rounded-lg text-sm transition-all ${!activeCategory
                                ? 'bg-[#036B3F] text-white font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            All Products
                        </Link>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                href={`/shop/${cat.slug}`}
                                className={`block px-3 py-2 rounded-lg text-sm transition-all ${activeCategory === cat.slug
                                    ? 'bg-stone-900 text-white font-medium'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
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
                <h3 className="text-[11px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-3">
                    Price Range
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => applyPrice(e.target.value, maxPrice)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-300"
                    />
                    <span className="text-stone-300 text-sm">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => applyPrice(minPrice, e.target.value)}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-300"
                    />
                </div>
            </div>

            {/* Reset */}
            {hasFilters && (
                <Link
                    href="/shop"
                    className="inline-block text-xs text-[#036B3F] hover:text-[#025a33] font-medium transition-colors"
                >
                    ← Reset all filters
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
