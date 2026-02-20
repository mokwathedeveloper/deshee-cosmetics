'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { ProductWithImages } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
    product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const router = useRouter();
    const imageUrl = product.product_images?.[0]?.url || '/images/placeholder.jpg';

    function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            compare_at_price: product.compare_at_price,
            image_url: imageUrl,
            stock: product.stock,
        });
        toast.success(`${product.name} added to cart`);
    }

    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
        : 0;

    return (
        <div className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-muted/30 cursor-pointer" onClick={() => router.push(`/product/${product.slug}`)}>
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Discount Badge */}
                {hasDiscount && (
                    <span className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">
                        -{discountPercent}%
                    </span>
                )}

                {/* Floating Action Buttons — appear on hover */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <button
                        className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm shadow-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Add to wishlist"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Heart className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/product/${product.slug}`);
                        }}
                        className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Quick view"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                </div>

                {/* Add to Cart — slides up from bottom */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="absolute bottom-0 left-0 right-0 z-10 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:bg-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                </button>
            </div>

            {/* Product Info */}
            <Link href={`/product/${product.slug}`} className="block p-4">
                {product.brand && (
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70 mb-1.5">
                        {product.brand}
                    </p>
                )}
                <h3 className="text-sm font-medium text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-2.5">
                    {product.rating > 0 ? (
                        <>
                            <div className="flex items-center" aria-label={`Rated ${product.rating} out of 5`}>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < Math.round(product.rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'fill-muted text-muted'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-medium">({product.rating_count})</span>
                        </>
                    ) : (
                        <span className="text-xs text-muted-foreground">No reviews yet</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-primary">
                        {formatCurrency(product.price)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                            {formatCurrency(product.compare_at_price!)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}
