import { ProductCard } from './product-card';
import { EmptyState } from '@/components/ui/empty-state';
import type { ProductWithImages } from '@/types/database';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
    products: ProductWithImages[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="No products found"
                description="Try adjusting your filters or search criteria."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
