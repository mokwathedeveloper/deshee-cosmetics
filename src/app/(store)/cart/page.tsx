'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="container py-32 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-3">Your cart is empty</h1>
                <p className="text-base text-muted-foreground mb-10 max-w-sm mx-auto">Discover something you love in our collection and bring it home today.</p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full text-sm font-bold hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    Start Shopping <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="mb-12">
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary mb-3">
                    Your Selection
                </p>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                    Shopping Cart
                </h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 p-5 bg-card rounded-2xl border border-border/50 hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                            <Link href={`/product/${item.slug}`} className="relative w-28 h-28 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                                <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="112px" />
                            </Link>
                            <div className="flex-1 min-w-0 py-1">
                                <Link href={`/product/${item.slug}`} className="font-bold text-foreground hover:text-primary text-base transition-colors line-clamp-1">
                                    {item.name}
                                </Link>
                                <p className="text-sm font-bold text-primary mt-1.5">{formatCurrency(item.price)}</p>
                                <div className="flex items-center gap-1.5 mt-4">
                                    <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/50">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground"
                                            aria-label="Decrease"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-xs font-bold w-8 text-center text-foreground">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground"
                                            aria-label="Increase"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between py-1">
                                <p className="font-black text-base text-foreground tracking-tight">{formatCurrency(item.price * item.quantity)}</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all"
                                    aria-label="Remove"
                                >
                                    <Trash2 className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-muted/30 rounded-3xl p-8 h-fit border border-border/50 sticky top-24">
                    <h2 className="text-lg font-bold text-foreground mb-6">Order Summary</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-medium">Subtotal</span>
                            <span className="text-foreground font-bold">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground font-medium">Shipping</span>
                            <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">Free</span>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border/50">
                            <div className="flex justify-between items-end">
                                <span className="text-foreground font-bold text-base">Total</span>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary tracking-tighter leading-none">{formatCurrency(total)}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">VAT included</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/checkout"
                        className="mt-8 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl text-sm font-bold hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                        Proceed to Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/shop"
                        className="mt-4 w-full flex items-center justify-center text-xs text-muted-foreground hover:text-foreground font-bold transition-colors py-2 uppercase tracking-widest"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
