import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/store/product-card';
import type { ProductWithImages } from '@/types/database';

type BestsellersProps = {
    products: ProductWithImages[];
};

export function Bestsellers({ products }: BestsellersProps) {
    return (
        <section className="py-24 md:py-32 bg-muted/30">
            <div className="container">
                <div className="text-center mb-16 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Customer Favorites</p>
                    <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                        Our Bestsellers
                    </h2>
                    <p className="text-base text-muted-foreground max-w-lg mx-auto">
                        Discover the products that have earned a permanent place in our customers&apos; beauty routines.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                
                <div className="text-center mt-16">
                    <Link
                        href="/shop"
                        className="group inline-flex items-center gap-3 bg-foreground text-background px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 active:scale-95"
                    >
                        Explore the Collection
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
