'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/database';

const CART_KEY = 'beautyshop-cart';

function getStoredCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function storeCart(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setItems(getStoredCart());
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            storeCart(items);
        }
    }, [items, isLoaded]);

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                        : i
                );
            }
            return [...prev, { ...item, quantity: Math.min(quantity, item.stock) }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal; // Could add shipping/tax here

    return {
        items,
        isLoaded,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        total,
    };
}
