import { getOrderById } from '@/actions/orders';
import { getSession } from '@/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Order Details',
};

interface Props {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
    const session = await getSession();
    if (!session) redirect('/auth/login');

    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/account" className="inline-flex items-center gap-1 text-sm text-pink-500 hover:text-pink-600 mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to Account
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{formatDate(order.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>

            {/* Items */}
            <div className="border rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium">Product</th>
                            <th className="text-right px-4 py-3 font-medium">Price</th>
                            <th className="text-right px-4 py-3 font-medium">Qty</th>
                            <th className="text-right px-4 py-3 font-medium">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {order.order_items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3 text-right">{formatCurrency(item.unit_price)}</td>
                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.line_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                {/* Shipping Info */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Shipping Details</h3>
                    <div className="text-sm space-y-1 text-gray-600">
                        <p>{order.customer_name}</p>
                        <p>{order.customer_email}</p>
                        {order.customer_phone && <p>{order.customer_phone}</p>}
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}</p>
                    </div>
                </div>

                {/* Order Total */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Order Total</h3>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
