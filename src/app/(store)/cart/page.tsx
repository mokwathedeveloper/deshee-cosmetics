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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-5">
                    <ShoppingBag className="h-7 w-7 text-stone-400" />
                </div>
                <h1 className="text-xl font-semibold text-stone-900 mb-2">Your cart is empty</h1>
                <p className="text-sm text-stone-400 mb-8">Discover something you love in our collection.</p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#036B3F] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#025a33] transition-all"
                >
                    Start Shopping <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#036B3F] mb-2">
                    Review
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">
                    Shopping Cart
                </h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl border border-stone-100 hover:border-stone-200 transition-colors">
                            <Link href={`/product/${item.slug}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-stone-50 flex-shrink-0">
                                <Image src={item.image_url} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="96px" />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link href={`/product/${item.slug}`} className="font-medium text-gray-800 hover:text-[#036B3F] text-sm transition-colors">
                                    {item.name}
                                </Link>
                                <p className="text-sm font-semibold text-stone-900 mt-1">{formatCurrency(item.price)}</p>
                                <div className="flex items-center gap-1 mt-2.5">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                                        aria-label="Decrease"
                                    >
                                        <Minus className="h-3 w-3 text-stone-500" />
                                    </button>
                                    <span className="text-sm font-medium w-8 text-center text-stone-800">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                                        aria-label="Increase"
                                    >
                                        <Plus className="h-3 w-3 text-stone-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                                <p className="font-semibold text-sm text-stone-900">{formatCurrency(item.price * item.quantity)}</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-300 hover:text-[#E02B27] transition-colors"
                                    aria-label="Remove"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-stone-50 rounded-2xl p-6 h-fit border border-stone-100">
                    <h2 className="text-sm font-semibold text-stone-900 mb-5">Order Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-stone-500">Subtotal</span>
                            <span className="text-stone-800 font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Shipping</span>
                            <span className="text-emerald-600 font-medium">Free</span>
                        </div>
                        <div className="border-t border-stone-200 pt-3 mt-3">
                            <div className="flex justify-between font-semibold text-base">
                                <span className="text-stone-900">Total</span>
                                <span className="text-stone-900">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/checkout"
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-[#036B3F] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#025a33] transition-all"
                    >
                        Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/shop"
                        className="mt-3 w-full flex items-center justify-center text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors py-2"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
