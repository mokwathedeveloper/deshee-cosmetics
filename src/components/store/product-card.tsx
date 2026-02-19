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
        <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer" onClick={() => router.push(`/product/${product.slug}`)}>
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Discount Badge */}
                {hasDiscount && (
                    <span className="absolute top-3 left-3 z-10 bg-[#FF5722] text-white text-[10px] font-bold px-2 py-1 rounded">
                        -{discountPercent}%
                    </span>
                )}

                {/* Floating Action Buttons — appear on hover */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <button
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#E02B27] hover:scale-110 transition-all"
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
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#036B3F] hover:scale-110 transition-all"
                        aria-label="Quick view"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                </div>

                {/* Add to Cart — slides up from bottom */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="absolute bottom-0 left-0 right-0 z-10 bg-[#036B3F] text-white text-xs font-semibold uppercase tracking-wider py-3 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:bg-gray-400"
                >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                </button>
            </div>

            {/* Product Info */}
            <Link href={`/product/${product.slug}`} className="block p-3.5">
                {product.brand && (
                    <p className="text-[10px] font-medium tracking-wider uppercase text-gray-400 mb-1">
                        {product.brand}
                    </p>
                )}
                <h3 className="text-sm font-medium text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-[#036B3F] transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.round(product.rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-[11px] text-gray-400">({product.rating_count})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#E02B27]">
                        {formatCurrency(product.price)}
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(product.compare_at_price!)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}
