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
        <div className="container py-8 md:py-16">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-20">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
                        <Image
                            src={currentImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        {hasDiscount && (
                            <span className="absolute top-5 left-5 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                -{discountPercent}%
                            </span>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-3 px-1">
                            {images.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${selectedImage === index
                                        ? 'ring-2 ring-primary ring-offset-4'
                                        : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
                                        }`}
                                >
                                    <Image src={img.url} alt={img.alt || ''} fill className="object-cover" sizes="80px" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col pt-2">
                    {/* Brand */}
                    {product.brand && (
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary mb-3">
                            {product.brand}
                        </p>
                    )}

                    <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4 leading-[1.1]">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-muted text-muted'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                            {product.rating} <span className="mx-1 opacity-50">·</span> {product.rating_count} reviews
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-black text-primary tracking-tighter">
                            {formatCurrency(product.price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xl text-muted-foreground line-through decoration-muted-foreground/30">
                                {formatCurrency(product.compare_at_price!)}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="prose prose-sm prose-stone mb-10">
                            <p className="text-base text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="mb-8">
                        {product.stock > 0 ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    In Stock {product.stock <= 10 && `— Only ${product.stock} left`}
                                </span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                            </div>
                        )}
                    </div>

                    {/* Quantity + Add to Cart */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10">
                        <div className="flex items-center bg-muted/50 rounded-2xl p-1.5 border border-border/50">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center text-base font-bold text-foreground">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground"
                                aria-label="Increase quantity"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex-1 flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 px-8 rounded-2xl text-base font-bold hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span>Add to Cart</span>
                            <span className="opacity-30 mx-1">|</span>
                            <span>{formatCurrency(product.price * quantity)}</span>
                        </button>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-3 gap-6 pt-10 border-t border-border/50">
                        {[
                            { icon: Truck, label: 'Free Delivery', desc: 'Over KSh 5,000' },
                            { icon: RotateCcw, label: 'Easy Returns', desc: '7 days' },
                            { icon: Shield, label: 'Authentic', desc: '100% genuine' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3 group-hover:bg-primary/5 transition-colors">
                                    <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-xs font-bold text-foreground mb-0.5">{item.label}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* SKU */}
                    {product.sku && (
                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground/30 mt-8 uppercase">SKU: {product.sku}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
