'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
];

function SortSelectInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    function handleSort(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        router.push(`?${params.toString()}`);
    }

    return (
        <select
            value={currentSort}
            onChange={(e) => handleSort(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-300 cursor-pointer"
        >
            {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}

export function SortSelect() {
    return (
        <Suspense>
            <SortSelectInner />
        </Suspense>
    );
}
