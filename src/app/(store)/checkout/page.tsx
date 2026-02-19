'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { createOrder } from '@/actions/orders';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, subtotal, total, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        shipping_city: '',
        notes: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);
        const result = await createOrder(formData, items);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        setOrderNumber(result.order?.order_number || '');
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully!');
    }

    if (orderPlaced) {
        return (
            <div className="max-w-md mx-auto py-20 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600 mb-1">Thank you for your purchase.</p>
                <p className="text-sm text-muted-foreground mb-6">Order Number: <strong>{orderNumber}</strong></p>
                <div className="flex gap-3 justify-center">
                    <Link href="/account">
                        <Button variant="outline">View Orders</Button>
                    </Link>
                    <Link href="/shop">
                        <Button className="bg-pink-500 hover:bg-pink-600">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Your cart is empty</p>
                <Link href="/shop">
                    <Button className="bg-pink-500 hover:bg-pink-600 mt-4">Go Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="customer_name">Full Name *</Label>
                            <Input id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleChange} required className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="customer_phone">Phone</Label>
                            <Input id="customer_phone" name="customer_phone" value={formData.customer_phone} onChange={handleChange} className="mt-1" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="customer_email">Email *</Label>
                        <Input id="customer_email" name="customer_email" type="email" value={formData.customer_email} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="shipping_address">Shipping Address *</Label>
                        <Input id="shipping_address" name="shipping_address" value={formData.shipping_address} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="shipping_city">City *</Label>
                        <Input id="shipping_city" name="shipping_city" value={formData.shipping_city} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600 text-white" size="lg">
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </Button>
                </form>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t pt-2">
                            <div className="flex justify-between font-semibold text-base">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
