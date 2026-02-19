'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';
import type { ProductWithImages } from '@/types/database';
import { toast } from 'sonner';

interface ProductDetailClientProps {
    product: ProductWithImages;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem } = useCart();

    const images = product.product_images || [];
    const currentImage = images[selectedImage]?.url || '/images/placeholder.jpg';

    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
        : 0;

    function handleAddToCart() {
        addItem(
            {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                compare_at_price: product.compare_at_price,
                image_url: currentImage,
                stock: product.stock,
            },
            quantity
        );
        toast.success(`${product.name} added to cart`);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
                {/* Image Gallery */}
                <div className="space-y-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-50">
                        <Image
                            src={currentImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        {hasDiscount && (
                            <span className="absolute top-4 left-4 bg-[#FF5722] text-white text-xs font-bold px-3 py-1.5 rounded">
                                -{discountPercent}%
                            </span>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2">
                            {images.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all ${selectedImage === index
                                        ? 'ring-2 ring-stone-900 ring-offset-2'
                                        : 'opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="64px" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    {/* Brand */}
                    {product.brand && (
                        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#036B3F] mb-2">
                            {product.brand}
                        </p>
                    )}

                    <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight mb-3">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-stone-200 text-stone-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-stone-400">
                            {product.rating} · {product.rating_count} reviews
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-3xl font-bold text-[#E02B27]">
                            {formatCurrency(product.price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-lg text-stone-400 line-through">
                                {formatCurrency(product.compare_at_price!)}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p className="text-sm text-stone-500 leading-relaxed mb-8">
                            {product.description}
                        </p>
                    )}

                    {/* Stock Status */}
                    <div className="mb-6">
                        {product.stock > 0 ? (
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm text-emerald-600 font-medium">
                                    In Stock {product.stock <= 10 && `— Only ${product.stock} left`}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                <span className="text-sm text-rose-600 font-medium">Out of Stock</span>
                            </div>
                        )}
                    </div>

                    {/* Quantity + Add to Cart */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-3 hover:bg-gray-50 transition-colors text-gray-500"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center text-sm font-medium text-gray-800">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="p-3 hover:bg-gray-50 transition-colors text-gray-500"
                                aria-label="Increase quantity"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#036B3F] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#025a33] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Add to Cart — {formatCurrency(product.price * quantity)}
                        </button>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-100">
                        {[
                            { icon: Truck, label: 'Free Shipping', desc: 'Over $50' },
                            { icon: RotateCcw, label: 'Easy Returns', desc: '30 days' },
                            { icon: Shield, label: 'Authentic', desc: '100% genuine' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <item.icon className="h-5 w-5 text-stone-400 mx-auto mb-1.5" />
                                <p className="text-[11px] font-medium text-stone-700">{item.label}</p>
                                <p className="text-[10px] text-stone-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* SKU */}
                    {product.sku && (
                        <p className="text-[11px] text-stone-300 mt-6">SKU: {product.sku}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
