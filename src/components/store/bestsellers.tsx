import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import type { ProductWithImages } from '@/types/database';

type BestsellersProps = {
    products: ProductWithImages[];
};

export function Bestsellers({ products }: BestsellersProps) {
    return (
        <section className="py-16 md:py-20 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Bestsellers
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Most loved by our customers</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all"
                    >
                        View All Products
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
